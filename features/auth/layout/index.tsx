import Logo from "@/components/logo"

export default function AuthLayout(props: LayoutProps<"/">) {
  return (
    <div className="flex flex-col items-center justify-center gap-1 px-5">
      <Logo />
      <div className="w-full max-w-md">{props.children}</div>
    </div>
  )
}
