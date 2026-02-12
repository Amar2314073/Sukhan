import usePWAInstall from "@/hooks/usePWAInstall";

const InstallSukhanButton = () => {
  const { isInstallable, installApp } = usePWAInstall();

  if (!isInstallable) return null;

  return (
    <button
      onClick={installApp}
      className="btn btn-ghost btn-outline"
    >
      📲 Install Sukhan App
    </button>
  );
};

export default InstallSukhanButton;
