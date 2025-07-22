import { redirect } from "next/navigation";

export default async function HandleServiceCmsError(data: Response) {
  if (data.status === 401) {
    console.log("* 401 error");
    console.log("* redirect to '/cms/login'");
    return redirect("/cms/login");
  }
}
