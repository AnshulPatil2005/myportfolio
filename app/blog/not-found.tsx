import { Metadata } from "next";
import NotFoundComponent from "../components/shared/NotFound";

export const metadata: Metadata = {
  title: "Post Not Found",
};

export default function PostNotFound() {
  return (
    <NotFoundComponent
      title="Post Not Found"
      description="That post doesn't exist on this site."
    />
  );
}
