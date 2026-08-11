import { EditorPage } from "@/components/editor/editor-page";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EditorPage sourceId={id} />;
}
