import { redirect } from "next/navigation";


export default async function CoursesPage({ params, }: { params:{ cid: string }; }) {
 const { cid } = params;
 redirect(`/Courses/${cid}/Home`);
}
