import { redirect } from "next/navigation";

type Props = { params: Promise<{ id: string }> };

export default async function ServicePage({ params }: Props) {
  const { id } = await params;
  redirect(`/admin/services/${id}/edit`);
}
