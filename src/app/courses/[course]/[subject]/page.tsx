"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function SubjectDetailPageRedirect() {
  const params = useParams();
  const router = useRouter();
  
  const courseParam = (params.course as string) || "dece-assignment";
  const subjectParam = (params.subject as string) || "";

  useEffect(() => {
    // Redirect to parent category explorer page with subject query parameter
    if (subjectParam) {
      router.replace(`/courses/${courseParam}?subject=${encodeURIComponent(subjectParam)}`);
    } else {
      router.replace(`/courses/${courseParam}`);
    }
  }, [courseParam, subjectParam, router]);

  return (
    <div className="w-full min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center space-y-2">
        <Loader2 className="h-6 w-6 animate-spin text-[#a15c00] mx-auto" />
        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Redirecting to explorer...</p>
      </div>
    </div>
  );
}
