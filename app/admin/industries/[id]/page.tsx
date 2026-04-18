import { redirect } from "next/navigation";

type Props = { params: Promise<{ id: string }> };

export default async function IndustryPage({ params }: Props) {
  const { id } = await params;
  redirect(`/admin/industries/${id}/edit`);
}
