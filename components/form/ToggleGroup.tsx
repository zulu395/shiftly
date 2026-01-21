import { cn } from "@/lib/utils";

export type ToggleGroupProps = {
  active?: boolean;
  title: string;
  subtitle: string;
  icon?: React.ReactNode;
  onClick?: (v: string) => void;
  value: string;
};

export default function ToggleGroup(props: ToggleGroupProps) {
  return (
    <button
      onClick={() => props.onClick?.(props.value)}
      type="button"
      role="button"
      className={cn(
        "bg-white rounded-lg p-4 drop-shadow-xs grid gap-4 border border-white text-left",
        {
          "border-brand-primary": props.active,
        }
      )}
    >
      <div className="flex justify-between items-center">
        <span className="text-xl">{defaultSvg}</span>
        <div
          className={cn(
            "rounded-full border aspect-square size-4 flex justify-center items-center",
            {
              "border-brand-primary": props.active,
            }
          )}
        >
          <div
            className={cn("rounded-full size-2.5", {
              "bg-brand-primary": props.active,
            })}
          />
        </div>
      </div>
      <p className="h4 font-semibold text-gray-800">{props.title}</p>
      <p className="h6 text-gray-600">{props.subtitle}</p>
    </button>
  );
}

const defaultSvg = (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M19.2799 21H12.3799C12.1673 21.0177 11.9533 20.9927 11.7505 20.9265C11.5477 20.8603 11.3601 20.7542 11.199 20.6144C11.0378 20.4747 10.9061 20.3041 10.8119 20.1127C10.7176 19.9213 10.6625 19.713 10.6499 19.5V15.5C10.6625 15.2871 10.7176 15.0787 10.8119 14.8874C10.9061 14.696 11.0378 14.5254 11.199 14.3856C11.3601 14.2459 11.5477 14.1398 11.7505 14.0735C11.9533 14.0073 12.1673 13.9823 12.3799 14H19.2799C19.492 13.9823 19.7055 14.0074 19.9077 14.0737C20.1099 14.1401 20.2968 14.2463 20.4572 14.3862C20.6176 14.5261 20.7483 14.6967 20.8415 14.8881C20.9347 15.0794 20.9886 15.2875 20.9999 15.5V19.5C20.9593 19.9226 20.7585 20.3135 20.4386 20.5925C20.1186 20.8715 19.704 21.0173 19.2799 21Z"
      stroke="#15171B"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M16.8999 12H14.7499C14.658 11.99 14.5651 11.9998 14.4772 12.0286C14.3894 12.0574 14.3087 12.1046 14.2406 12.1671C14.1724 12.2295 14.1184 12.3058 14.0821 12.3908C14.0457 12.4758 14.028 12.5676 14.0299 12.66V14H17.6199V12.66C17.6219 12.5676 17.6041 12.4758 17.5678 12.3908C17.5315 12.3058 17.4774 12.2295 17.4093 12.1671C17.3412 12.1046 17.2605 12.0574 17.1726 12.0286C17.0848 11.9998 16.9918 11.99 16.8999 12Z"
      stroke="#15171B"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M10.6499 17.29H20.9999"
      stroke="#15171B"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M10.0401 8.46C11.5478 8.46 12.7701 7.23774 12.7701 5.73C12.7701 4.22226 11.5478 3 10.0401 3C8.53232 3 7.31006 4.22226 7.31006 5.73C7.31006 7.23774 8.53232 8.46 10.0401 8.46Z"
      stroke="#15171B"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M3 18.45V17.55C3 15.6935 3.7375 13.913 5.05025 12.6003C6.36301 11.2875 8.14348 10.55 10 10.55H10.09C10.7363 10.5478 11.3796 10.6388 12 10.82"
      stroke="#15171B"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);
