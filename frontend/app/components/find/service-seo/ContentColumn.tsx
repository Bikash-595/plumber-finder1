export default function ContentColumn({
  number,
  title,
  items,
  border = true,
}: {
  number: string;
  title: string;
  items: string[];
  border?: boolean;
}) {
  return (
    <div
      className={`
        p-6
        sm:p-7
        lg:p-8
        ${
          border
            ? "border-b border-slate-200 md:border-b-0 md:border-r"
            : ""
        }
      `}
    >

      {/* COLUMN HEADER */}

      <div className="flex items-center gap-3">

        <div
          className="
            flex
            h-9
            w-9
            shrink-0
            items-center
            justify-center
            rounded-lg
            bg-[#fff7bf]
            text-xs
            font-extrabold
            text-[#0f2a4d]
          "
        >
          {number}
        </div>

        <h3
          className="
            text-lg
            font-bold
            tracking-tight
            text-[#0f2a4d]
          "
        >
          {title}
        </h3>

      </div>


      {/* CONTENT LIST */}

      <div className="mt-6 space-y-4">

        {items.map((item) => (
          <div
            key={item}
            className="
              group
              text-[15px]
              leading-6
              text-slate-600
              transition-colors
              duration-200
            "
          >
            <span
              className="
                inline
                cursor-default
                transition-colors
                group-hover:text-[#0f2a4d]
              "
            >
              {item}
            </span>
          </div>
        ))}

      </div>

    </div>
  );
}
