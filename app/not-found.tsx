import { Metadata } from "next";
import NotFoundComponent from "./components/shared/NotFound";

export const metadata: Metadata = {
  title: "Error 404",
};

export default function NotFound() {
  return (
    <NotFoundComponent
      title="Error 404"
      description="This page doesn't exist on anshulpatil.dev. While you're here, you can read some featured posts below."
    />
  );
}
