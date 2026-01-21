import Form from "./Form";

export default function Page() {
  return (
    <div className="grid gap-2 w-full">
      <h1 className="h1 text-center font-bold">Complete your profile</h1>
      <p className="h5 text-center font-medium text-pretty">
        We’ll use your details to set up your employee account and keep your
        shifts organized.
      </p>
      <Form />
    </div>
  );
}

