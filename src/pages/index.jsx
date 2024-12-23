import Link from "next/link";

export default function HomePage() {
  return (
    <div>
      <h1>Welcome to the Application</h1>
      <p>
        <Link href="/auth/login">Login</Link>
      </p>
      <p>
        <Link href="/auth/signup">Sign Up</Link>
      </p>
    </div>
  );
}
