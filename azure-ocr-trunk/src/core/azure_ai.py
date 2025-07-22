import logging
import time
from collections.abc import Callable
from pathlib import Path
from typing import Any, cast
from dataclasses import dataclass
import requests
from src.config.config import load_config

config = load_config()
azure_config = config.azure_ai_client()


def az_content_understanding_analyze(file_content):
    """
    This function uses Azure AI Content Understanding to analyze a file or URL.
    It requires either a subscription key or an AAD token for authentication.
    The function returns the formatted result of the analysis.
    """

    settings = Settings(
        endpoint=azure_config["AZ_CONTENT_UNDERSTANDING_ENDPOINT"],
        api_version=azure_config["AZ_CONTENT_UNDERSTANDING_API_VERSION"],
        # Either subscription_key or aad_token must be provided. Subscription Key is more prioritized.
        subscription_key=azure_config["AZ_CONTENT_UNDERSTANDING_KEY"],
        # aad_token="AZURE_CONTENT_UNDERSTANDING_AAD_TOKEN",
        # Insert the analyzer name.
        analyzer_id=azure_config["AZ_CONTENT_UNDERSTANDING_ID"],
        # Insert the supported file types of the analyzer.
        file_location=file_content,
    )
    # Create an instance of the AzureContentUnderstandingClient with the provided settings
    # and the specified endpoint, API version, subscription key, and token provider.
    client = AzureContentUnderstandingClient(
        settings.endpoint,
        settings.api_version,
        subscription_key=settings.subscription_key,
        token_provider=settings.token_provider,
    )
    response = client.begin_analyze(settings.analyzer_id, settings.file_location)
    result = client.poll_result(
        response,
        timeout_seconds=60 * 60,
        polling_interval_seconds=1,
    )

    formatted_result = client.result_formatting(result)

    # return json.dumps(formatted_result, indent=4, ensure_ascii=False)
    return formatted_result


@dataclass(frozen=True, kw_only=True)
class Settings:
    endpoint: str
    api_version: str
    subscription_key: str | None = None
    aad_token: str | None = None
    analyzer_id: str
    file_location: str

    def __post_init__(self):
        key_not_provided = (
            not self.subscription_key
            or self.subscription_key == "AZURE_CONTENT_UNDERSTANDING_SUBSCRIPTION_KEY"
        )
        token_not_provided = (
            not self.aad_token
            or self.aad_token == "AZURE_CONTENT_UNDERSTANDING_AAD_TOKEN"
        )
        if key_not_provided and token_not_provided:
            raise ValueError(
                "Either 'subscription_key' or 'aad_token' must be provided"
            )

    @property
    def token_provider(self) -> Callable[[], str] | None:
        aad_token = self.aad_token
        if aad_token is None:
            return None

        return lambda: aad_token


class AzureContentUnderstandingClient:
    def __init__(
        self,
        endpoint: str,
        api_version: str,
        subscription_key: str | None = None,
        token_provider: Callable[[], str] | None = None,
        x_ms_useragent: str = "cu-sample-code",
    ) -> None:
        if not subscription_key and token_provider is None:
            raise ValueError(
                "Either subscription key or token provider must be provided"
            )
        if not api_version:
            raise ValueError("API version must be provided")
        if not endpoint:
            raise ValueError("Endpoint must be provided")

        self._endpoint: str = endpoint.rstrip("/")
        self._api_version: str = api_version
        self._logger: logging.Logger = logging.getLogger(__name__)
        self._logger.setLevel(logging.INFO)
        self._headers: dict[str, str] = self._get_headers(
            subscription_key, token_provider and token_provider(), x_ms_useragent
        )

    def begin_analyze(self, analyzer_id: str, file_location: str):
        """
        Begins the analysis of a file or URL using the specified analyzer.

        Args:
            analyzer_id (str): The ID of the analyzer to use.
            file_location (str): The path to the file or the URL to analyze.

        Returns:
            Response: The response from the analysis request.

        Raises:
            ValueError: If the file location is not a valid path or URL.
            HTTPError: If the HTTP request returned an unsuccessful status code.
        """
        if Path(file_location).exists():
            with open(file_location, "rb") as file:
                data = file.read()
            headers = {"Content-Type": "application/octet-stream"}
        elif "https://" in file_location or "http://" in file_location:
            data = {"url": file_location}
            headers = {"Content-Type": "application/json"}
        else:
            raise ValueError("File location must be a valid path or URL.")

        headers.update(self._headers)
        if isinstance(data, dict):
            response = requests.post(
                url=self._get_analyze_url(
                    self._endpoint, self._api_version, analyzer_id
                ),
                headers=headers,
                json=data,
            )
        else:
            response = requests.post(
                url=self._get_analyze_url(
                    self._endpoint, self._api_version, analyzer_id
                ),
                headers=headers,
                data=data,
            )

        response.raise_for_status()
        self._logger.info(
            f"Analyzing file {file_location} with analyzer: {analyzer_id}"
        )
        return response

    def poll_result(
        self,
        response: requests.Response,
        timeout_seconds: int = 120,
        polling_interval_seconds: int = 2,
    ) -> dict[str, Any]:  # pyright: ignore[reportExplicitAny]
        """
        Polls the result of an asynchronous operation until it completes or times out.

        Args:
            response (Response): The initial response object containing the operation location.
            timeout_seconds (int, optional): The maximum number of seconds to wait for the operation to complete. Defaults to 120.
            polling_interval_seconds (int, optional): The number of seconds to wait between polling attempts. Defaults to 2.

        Raises:
            ValueError: If the operation location is not found in the response headers.
            TimeoutError: If the operation does not complete within the specified timeout.
            RuntimeError: If the operation fails.

        Returns:
            dict: The JSON response of the completed operation if it succeeds.
        """
        operation_location = response.headers.get("operation-location", "")
        if not operation_location:
            raise ValueError("Operation location not found in response headers.")

        headers = {"Content-Type": "application/json"}
        headers.update(self._headers)

        start_time = time.time()
        while True:
            elapsed_time = time.time() - start_time
            self._logger.info(
                "Waiting for service response", extra={"elapsed": elapsed_time}
            )
            if elapsed_time > timeout_seconds:
                raise TimeoutError(
                    f"Operation timed out after {timeout_seconds:.2f} seconds."
                )

            response = requests.get(operation_location, headers=self._headers)
            response.raise_for_status()
            result = cast(dict[str, str], response.json())
            status = result.get("status", "").lower()
            if status == "succeeded":
                self._logger.info(
                    f"Request result is ready after {elapsed_time:.2f} seconds."
                )
                return response.json()  # pyright: ignore[reportAny]
            elif status == "failed":
                self._logger.error(f"Request failed. Reason: {response.json()}")
                raise RuntimeError("Request failed.")
            else:
                self._logger.info(
                    f"Request {operation_location.split('/')[-1].split('?')[0]} in progress ..."
                )
            time.sleep(polling_interval_seconds)

    def _get_analyze_url(self, endpoint: str, api_version: str, analyzer_id: str):
        return f"{endpoint}/contentunderstanding/analyzers/{analyzer_id}:analyze?api-version={api_version}"

    def _get_headers(
        self, subscription_key: str | None, api_token: str | None, x_ms_useragent: str
    ) -> dict[str, str]:
        """Returns the headers for the HTTP requests.
        Args:
            subscription_key (str): The subscription key for the service.
            api_token (str): The API token for the service.
            enable_face_identification (bool): A flag to enable face identification.
        Returns:
            dict: A dictionary containing the headers for the HTTP requests.
        """
        headers = (
            {"Ocp-Apim-Subscription-Key": subscription_key}
            if subscription_key
            else {"Authorization": f"Bearer {api_token}"}
        )
        headers["x-ms-useragent"] = x_ms_useragent
        return headers

    def result_formatting(self, raw_data):

        receipt_data = {
            "merchant_name": None,
            "address": None,
            "unit_no": None,
            "mall_name": None,
            "transaction_date": None,
            "transaction_time": None,
            "items": [],
            "total": None,
            "tax_id": None,
            "receipt_no": None,
        }

        for key in raw_data["result"]["contents"][0]["fields"].keys():
            if key == "MerchantName":
                merchant_name = raw_data["result"]["contents"][0]["fields"][key]
                if merchant_name:
                    receipt_data["merchant_name"] = merchant_name.get(
                        "valueString", None
                    )

            if key == "Address":
                address = raw_data["result"]["contents"][0]["fields"][key]
                if address:
                    receipt_data["address"] = address.get("valueString", None)

            if key == "UnitNo":
                unit_no = raw_data["result"]["contents"][0]["fields"][key]
                if unit_no:
                    receipt_data["unit_no"] = unit_no.get("valueString", None)

            if key == "MallName":
                mall_name = raw_data["result"]["contents"][0]["fields"][key]
                if mall_name:
                    receipt_data["mall_name"] = mall_name.get("valueString", None)

            if key == "Date":
                transaction_date = raw_data["result"]["contents"][0]["fields"][key]
                if transaction_date:
                    receipt_data["transaction_date"] = transaction_date.get(
                        "valueDate", None
                    )

            if key == "Time":
                transaction_time = raw_data["result"]["contents"][0]["fields"][key]
                if transaction_time:
                    receipt_data["transaction_time"] = transaction_time.get(
                        "valueTime", None
                    )

            if key == "ReceiptNo":
                receipt_no = raw_data["result"]["contents"][0]["fields"][key]
                if receipt_no:
                    receipt_data["receipt_no"] = receipt_no.get("valueString", None)

            if key == "Items":
                items = (
                    raw_data.get("result", {})
                    .get("contents", [{}])[0]
                    .get("fields", {})
                    .get("Items", None)
                )

                if items:
                    # Safely access 'valueArray'
                    value_array = items.get("valueArray", [])

                    for item in value_array:
                        # Safely extract nested fields
                        item_object = item.get("valueObject", {})
                        item_name = item_object.get("Item", {})
                        item_quantity = item_object.get("Quantity", {})
                        item_price = item_object.get("Price", {})

                        # Construct the item_data dictionary
                        item_data = {
                            "item": item_name.get("valueString", None),
                            "quantity": item_quantity.get("valueNumber", None),
                            "price": item_price.get("valueNumber", None),
                        }
                        receipt_data["items"].append(item_data)

            if key == "TotalAmount":
                total = raw_data["result"]["contents"][0]["fields"][key]
                if total:
                    receipt_data["total"] = total.get("valueNumber", None)

            if key == "TaxId":
                tax_id = raw_data["result"]["contents"][0]["fields"][key]
                if tax_id:
                    receipt_data["tax_id"] = tax_id.get("valueString", None)

        return receipt_data


if __name__ == "__main__":
    result = az_content_understanding_analyze(
        "https://i.ibb.co/LDs50rXZ/Oh-Juice-Kanchaya.png"
    )
    print(result)
