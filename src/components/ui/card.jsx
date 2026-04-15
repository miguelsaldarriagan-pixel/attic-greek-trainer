export function Card({ className = "", children }) {
  return <div className={`bg-white ${className}`}>{children}</div>;
}
export function CardHeader({ className = "", children }) {
  return <div className={`p-5 pb-3 ${className}`}>{children}</div>;
}
export function CardTitle({ className = "", children }) {
  return <h3 className={`font-semibold ${className}`}>{children}</h3>;
}
export function CardContent({ className = "", children }) {
  return <div className={`p-5 pt-0 ${className}`}>{children}</div>;
}
