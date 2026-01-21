import FormButton from "./FormButton";

export default function ContinueWithGoogleButton() {
  return (
    <>
      <FormButton className="btn btn-white">
        {googleSvg}
        <span>Continue with Google</span>
      </FormButton>
    </>
  );
}

const googleSvg = (
  <svg
    width="1.2em"
    height="1.2em"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clip-path="url(#clip0_419_429)">
      <path
        d="M21.8052 12.2303C21.8052 11.5506 21.7501 10.8671 21.6325 10.1984H12.2002V14.0492H17.6016C17.3775 15.2911 16.6573 16.3898 15.6027 17.0879V19.5866H18.8252C20.7176 17.8449 21.8052 15.2728 21.8052 12.2303Z"
        fill="#4285F4"
      />
      <path
        d="M12.2 22.0007C14.8971 22.0007 17.1716 21.1152 18.8287 19.5866L15.6063 17.088C14.7097 17.6979 13.5522 18.0433 12.2037 18.0433C9.59486 18.0433 7.38285 16.2833 6.58917 13.9169H3.26379V16.4927C4.96139 19.8695 8.41904 22.0007 12.2 22.0007Z"
        fill="#34A853"
      />
      <path
        d="M6.58564 13.9169C6.16676 12.6749 6.16676 11.3301 6.58564 10.0881V7.51233H3.26395C1.84561 10.338 1.84561 13.667 3.26395 16.4927L6.58564 13.9169Z"
        fill="#FBBC04"
      />
      <path
        d="M12.2 5.95805C13.6257 5.936 15.0036 6.47247 16.0362 7.45722L18.8912 4.60218C17.0834 2.90459 14.684 1.97128 12.2 2.00067C8.41904 2.00067 4.96139 4.13185 3.26379 7.51234L6.58549 10.0881C7.3755 7.71811 9.59119 5.95805 12.2 5.95805Z"
        fill="#EA4335"
      />
    </g>
    <defs>
      <clipPath id="clip0_419_429">
        <rect width="20" height="20" fill="white" transform="translate(2 2)" />
      </clipPath>
    </defs>
  </svg>
);
