/**
 * Keep route changes visible immediately. A page-level fade left the server
 * rendered page transparent until client JavaScript had finished loading.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
