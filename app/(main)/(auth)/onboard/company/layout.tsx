import LayoutStepper from "./LayoutStepper";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <LayoutStepper />
      {children}
    </>
  );
}
