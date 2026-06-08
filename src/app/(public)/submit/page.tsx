import { PageTransition } from "@/components/public/PageTransition";
import { SubmissionForm } from "@/components/forms/SubmissionForm";

export const metadata = {
  title: "Submit Journal",
};

export default function SubmitPage() {
  return (
    <PageTransition>
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">Journal Submission</h1>
          <p className="mt-2 text-muted">
            Submit your research manuscript to the PAoM Journal. All fields marked
            with * are required.
          </p>
        </div>
        <SubmissionForm />
      </div>
    </PageTransition>
  );
}
