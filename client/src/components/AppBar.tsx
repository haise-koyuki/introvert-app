export default function AppBar() {
  return (
    <header className="bg-primary text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-medium">ReplyMinder</h1>
        <div className="flex items-center space-x-4">
          <button className="p-1 rounded-full hover:bg-white/10">
            <span className="material-icons">settings</span>
          </button>
          <button className="p-1 rounded-full hover:bg-white/10">
            <span className="material-icons">notifications</span>
          </button>
        </div>
      </div>
    </header>
  );
}
