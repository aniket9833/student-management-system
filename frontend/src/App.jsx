import StudentList from './pages/StudentList';

function App() {
  return (
    <div className="min-vh-100 bg-body-secondary">
      <nav className="navbar navbar-dark bg-primary shadow-sm">
        <div className="container-fluid px-4">
          <a className="navbar-brand fw-bold fs-5" href="/">
            <i className="bi bi-mortarboard-fill me-2" />
            StudentMS
          </a>
          <span className="navbar-text text-white-50 small d-none d-md-block">
            Student Management System
          </span>
        </div>
      </nav>

      <main>
        <StudentList />
      </main>

      <footer className="text-center text-muted small py-3 border-top bg-white mt-4">
        © {new Date().getFullYear()} StudentMS — Built with React + Vite +
        Node.js
      </footer>
    </div>
  );
}

export default App;
