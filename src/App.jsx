import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { AnimatePresence } from "framer-motion";

// Layout Components
import Sidebar from "@/components/organisms/Sidebar";
import Header from "@/components/organisms/Header";

// Page Components
import CourseCatalog from "@/components/pages/CourseCatalog";
import CourseDetail from "@/components/pages/CourseDetail";
import LessonView from "@/components/pages/LessonView";
import QuizPage from "@/components/pages/QuizPage";
import MyLearning from "@/components/pages/MyLearning";
import ProgressPage from "@/components/pages/ProgressPage";
import BookmarksPage from "@/components/pages/BookmarksPage";
import CertificatesPage from "@/components/pages/CertificatesPage";

const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background text-white">
        {/* Sidebar */}
        <Sidebar 
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main Content */}
        <div className="lg:pl-64">
          {/* Header */}
          <Header 
            onMenuClick={() => setSidebarOpen(true)}
          />

          {/* Page Content */}
          <main className="min-h-[calc(100vh-4rem)]">
            <AnimatePresence mode="wait">
<Routes>
                <Route path="/" element={<CourseCatalog />} />
                <Route path="/course/:courseId" element={<CourseDetail />} />
                <Route path="/lesson/:courseId/:moduleId/:lessonId" element={<LessonView />} />
                <Route path="/quiz/:courseId/:moduleId" element={<QuizPage />} />
                <Route path="/learning" element={<MyLearning />} />
                <Route path="/progress" element={<ProgressPage />} />
                <Route path="/bookmarks" element={<BookmarksPage />} />
                <Route path="/certificates" element={<CertificatesPage />} />
              </Routes>
            </AnimatePresence>
          </main>
        </div>

        {/* Toast Notifications */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </div>
    </BrowserRouter>
  );
};

export default App;