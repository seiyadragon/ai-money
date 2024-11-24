import Hero from "@/components/hero";
import HeaderAuth from "@/components/header-auth";

export default async function Index() {
  return (
    <>
      <Hero />
      <div className="flex flex-col gap-8 justify-center items-center">
        <div className="flex flex-col gap-4">
          <p>
            Effortlessly manage your expenses and income with the power of AI. 
            SmartFinancer turns your words into actionable entries—just describe your financial activities in plain language, and we'll handle the rest.
          </p>
          <span>Simply type something like:</span>
          <ol className="list-none ml-2">
            <li><span><i>"Bought groceries for $50 yesterday"</i> or</span></li>
            <li><span><i>"Received $200 for freelance work on Monday"</i></span></li>
          </ol>
          <span>
            Our intelligent system will automatically extract the date, description, and amount, creating a neat, organized record in your expense and income tracker.
          </span>
          <span>Start simplifying your financial management today!</span>
        </div>
        <span>Sign up or log in to get started!</span>
        <HeaderAuth />
      </div>
    </>
  );
}
