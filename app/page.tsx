export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <div className="mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Demographics Dashboard
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              A new tool for Austria coming soon
            </p>
          </div>

          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-3">Coming Soon</h2>
            <p className="text-blue-100">
              We're building an innovative dashboard for demographic analysis.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="bg-gray-50 rounded-lg p-4 flex-1">
              <h3 className="font-semibold text-gray-900 mb-2">
                📊 Visualizations
              </h3>
              <p className="text-sm text-gray-600">Interactive charts & maps</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 flex-1">
              <h3 className="font-semibold text-gray-900 mb-2">🔍 Analytics</h3>
              <p className="text-sm text-gray-600">Deep demographic insights</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 flex-1">
              <h3 className="font-semibold text-gray-900 mb-2">
                🇦🇹 Austria Focus
              </h3>
              <p className="text-sm text-gray-600">
                Tailored for Austrian data
              </p>
            </div>
          </div>

          <div className="mt-8">
            <div className="inline-flex items-center px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
              <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2 animate-pulse"></div>
              In Development
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
