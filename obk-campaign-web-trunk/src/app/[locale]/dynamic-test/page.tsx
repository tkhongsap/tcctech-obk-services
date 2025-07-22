import DynamicContentGet from "@/services/DynamicContentGet";

export default async function DynamicTestPage() {
  const [error, data] = await DynamicContentGet();

  return (
    <div>
      {data && (
        <div className="p-4 max-w-5xl mx-auto">
          <div className="mt-4">
            {data.header?.header?.title && (
              <div className="text-xl">{data.header.header.title}</div>
            )}
            {data.header?.header?.subtitle && (
              <div className="text-lg mt-2">{data.header.header.subtitle}</div>
            )}
            {data.header?.header?.description && (
              <div
                className="mt-2"
                dangerouslySetInnerHTML={{
                  __html: data.header.header.description,
                }}
              />
            )}
          </div>
          <div className="mt-4 space-y-4 min-h-[600px]">
            {data.description?.sessions?.session1 && (
              <div
                dangerouslySetInnerHTML={{
                  __html: data.description.sessions.session1.description,
                }}
              />
            )}
            {data.description?.sessions?.session2 && (
              <div
                dangerouslySetInnerHTML={{
                  __html: data.description.sessions.session2.description,
                }}
              />
            )}
            {data.description?.sessions?.session3 && (
              <div
                dangerouslySetInnerHTML={{
                  __html: data.description.sessions.session3.description,
                }}
              />
            )}
          </div>
          <hr />
          <div className="mt-4">
            {data.footer?.footer.title && (
              <div className="text-xl">{data.footer.footer.title}</div>
            )}
            {data.footer?.footer.subtitle && (
              <div className="text-lg mt-2">{data.footer.footer.subtitle}</div>
            )}
            {data.footer?.footer.description && (
              <div
                className="mt-2"
                dangerouslySetInnerHTML={{
                  __html: data.footer.footer.description,
                }}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
