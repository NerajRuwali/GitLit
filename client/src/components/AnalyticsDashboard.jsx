import { useState } from 'react';
import Sidebar from './Sidebar';
import DashboardNavbar from './DashboardNavbar';
import ProfileCard from './ProfileCard';
import RepoList from './RepoList';
import Dashboard from './Dashboard'; // The existing StatsGrid
import GitHubHeatmap from './charts/GitHubHeatmap';
import CommitTimeline from './charts/CommitTimeline';
import LanguagePie from './charts/LanguagePie';
import WordCloud from './charts/WordCloud';
import AIInsights from './AIInsights';

export default function AnalyticsDashboard({ data, dataType, query, setQuery, onSearch, loading }) {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="flex flex-col md:flex-row bg-[#0a0a0a] min-h-screen text-white scrollbar-hide overflow-y-auto">
      
      {/* Sidebar - Fix height to screen */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Pane */}
      <main className="flex-1 flex flex-col relative overflow-y-auto overflow-x-hidden scroll-smooth custom-scrollbar">
        
        {/* Top Sticky Navbar */}
        <DashboardNavbar 
          query={query} 
          setQuery={setQuery} 
          onSearch={onSearch} 
          loading={loading}
          profileData={data} 
        />

        <div className="w-full max-w-none px-4 p-4 space-y-8 pb-32">
          
          <ProfileCard data={data} dataType={dataType} />

          <section className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <h4 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-4 px-2">Key Metrics</h4>
            <Dashboard data={data} type={dataType} />
          </section>

          <section className="animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
            <AIInsights data={data} dataType={dataType} />
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 flex flex-col space-y-6 animate-fade-in-up items-stretch" style={{ animationDelay: '0.2s' }}>
               <GitHubHeatmap commitsPerDay={data?.analysis?.commitsPerDay || {}} />
               <CommitTimeline 
                 dailyData={data?.analysis?.commitsPerDay || {}} 
                 monthlyData={data?.analysis?.commitsPerMonth || {}} 
                 dark={true} 
               />
               
               <div className="pt-4">
                 <RepoList />
               </div>
            </div>

            {/* Right Minor Column */}
            <div className="lg:col-span-4 flex flex-col space-y-6 animate-fade-in-up items-stretch" style={{ animationDelay: '0.3s' }}>
               <div className="flex-1 w-full min-h-[300px]"><LanguagePie languages={data?.analysis?.languages || {}} /></div>
               <div className="flex-1 w-full min-h-[300px]"><WordCloud words={data?.analysis?.wordCloud || []} /></div>
            </div>
          </div>
        </div>
      </main>

    </div>
  );
}
