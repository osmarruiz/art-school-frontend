import { label } from "framer-motion/client";

const SwitcherTutor = ({ enabled, onToggle, labelId }: { enabled: boolean; onToggle: (value: boolean) => void; labelId: string}) => {

  return (
    <div>
      <label
        htmlFor={labelId}
        className="flex cursor-pointer select-none items-center"
      >
        <div className="relative">
          <input
            type="checkbox"
            id={labelId}
            className="sr-only"
            onChange={(e) => onToggle(e.target.checked) }
          />
          <div className="block h-8 w-14 rounded-full bg-meta-9 dark:bg-[#5A616B]"></div>
          <div
            className={`absolute left-1 top-1 h-6 w-6 rounded-full bg-white transition ${
              enabled && '!right-1 !translate-x-full !bg-primary dark:!bg-white'
            }`}
          ></div>
        </div>
      </label>
    </div>
  );
};

export default SwitcherTutor;
