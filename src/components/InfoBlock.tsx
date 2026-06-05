type InfoBlockProps = {
  title: string;
  description?: string;
  content: string;
};

export default function InfoBlock({
  title,
  description,
  content,
}: InfoBlockProps) {
  if (!content || content.trim() === "") {
    return null;
  }

  return (
    <div className="rounded-[2rem] border border-neutral-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h3 className="text-lg font-semibold tracking-tight text-neutral-950">
          {title}
        </h3>

        {description ? (
          <p className="mt-1 text-sm leading-6 text-neutral-500">
            {description}
          </p>
        ) : null}
      </div>

      <pre className="whitespace-pre-wrap break-words font-sans text-sm leading-7 text-neutral-700">
        {content}
      </pre>
    </div>
  );
}