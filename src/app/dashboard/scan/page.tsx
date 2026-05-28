import { ScanWorkspace } from "@/components/scan/scan-workspace";

export default function ScanPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">AI Scan Workspace</h1>
        <p className="text-muted-foreground">Multi-agent autonomous threat analysis</p>
      </div>
      <ScanWorkspace />
    </div>
  );
}
