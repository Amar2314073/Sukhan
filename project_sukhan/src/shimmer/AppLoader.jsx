export default function AppLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-100">
      <div className="relative w-40 h-40">

        {/* Rotating ring */}
        <div className="absolute inset-0 rounded-full border-4 
                        border-transparent 
                        border-t-primary 
                        border-r-base-content/40 
                        animate-spin">
        </div>

        {/* Inner soft circle */}
        <div className="absolute inset-6 rounded-full 
                        border border-base-content/20">
        </div>

        {/* Center text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-base-content tracking-widest">
            LOADING...
          </p>
        </div>

      </div>
    </div>
  );
}
