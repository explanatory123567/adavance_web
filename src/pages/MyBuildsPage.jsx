import React from 'react';
import './MyBuildsPage.css';
import { useApp } from '../context/AppContext';
import { Layers, Wrench, Copy, Trash2, ShoppingCart, Zap, Calendar, Plus } from 'lucide-react';
export default function MyBuildsPage() {
  const {
    savedBuilds,
    setSavedBuilds,
    addCustomBuildToCart,
    setCurrentPage,
    showToast
  } = useApp();
  const handleOpenInBuilder = build => {
    // Attempt to match components into builder slots if available
    showToast('Build Loaded', `"${build.name}" loaded into 3D PC Builder Studio.`, 'success');
    setCurrentPage('builder');
  };
  const handleDuplicate = build => {
    const clone = {
      ...build,
      id: 'build-' + Date.now(),
      name: `${build.name} (Copy)`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setSavedBuilds(prev => [clone, ...prev]);
    showToast('Build Duplicated', `"${clone.name}" created.`, 'success');
  };
  const handleDelete = buildId => {
    setSavedBuilds(prev => prev.filter(b => b.id !== buildId));
    showToast('Build Deleted', 'Saved configuration removed.', 'info');
  };
  return <div className="my-builds-page inline-mybuildspage-0">
      <div className="container-wide">
        {/* Header */}
        <div className="flex-between inline-mybuildspage-1">
          <div>
            <div className="inline-mybuildspage-2">
              <span className="badge badge-cyan">SAVED WORKSPACES</span>
              <span className="inline-mybuildspage-3">
                {savedBuilds.length} Custom Configurations Saved
              </span>
            </div>
            <h1 className="inline-mybuildspage-4">My Custom PC Builds</h1>
            <p className="inline-mybuildspage-5">
              Manage your personal high-performance PC configurations, benchmark scores, and order quotes.
            </p>
          </div>

          <button onClick={() => setCurrentPage('builder')} className="btn btn-primary">
            <Plus size={16} /> Create New Build
          </button>
        </div>

        {/* Builds Grid */}
        {savedBuilds.length === 0 ? <div className="cyber-card-static inline-mybuildspage-6">
            <Layers size={48} color="var(--text-muted)" className="inline-mybuildspage-7" />
            <h3 className="inline-mybuildspage-8">No Saved Builds Yet</h3>
            <p className="inline-mybuildspage-9">
              Launch the 3D PC Builder Studio to customize and save your dream gaming setup.
            </p>
            <button onClick={() => setCurrentPage('builder')} className="btn btn-primary btn-sm">
              Launch PC Builder
            </button>
          </div> : <div className="grid-cols-3">
            {savedBuilds.map(build => <div key={build.id} className="cyber-card inline-mybuildspage-10">
                {/* Build Image & Score */}
                <div className="inline-mybuildspage-11">
                  <img src={build.image || "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=500&auto=format&fit=crop&q=80"} alt={build.name} className="inline-mybuildspage-12" />

                  <div className="inline-mybuildspage-13">
                    <span className="badge badge-cyan inline-mybuildspage-14">
                      <Zap size={11} /> Score {build.score}/100
                    </span>
                  </div>

                  <div className="inline-mybuildspage-15">
                    <Calendar size={12} /> {build.createdAt}
                  </div>
                </div>

                {/* Build Details */}
                <div className="inline-mybuildspage-16">
                  <div className="flex-between inline-mybuildspage-17">
                    <h3 className="inline-mybuildspage-18">{build.name}</h3>
                    <div className="inline-mybuildspage-19">
                      ₱{build.totalPrice?.toLocaleString()}
                    </div>
                  </div>

                  {/* Components Summary Pills */}
                  <div className="inline-mybuildspage-20">
                    {build.components && Object.entries(build.components).slice(0, 4).map(([key, val]) => <div key={key} className="flex-between">
                        <span className="inline-mybuildspage-21">
                          {key}:
                        </span>
                        <span className="inline-mybuildspage-22">
                          {val}
                        </span>
                      </div>)}
                  </div>

                  {/* Action Buttons Row */}
                  <div className="inline-mybuildspage-23">
                    <button onClick={() => addCustomBuildToCart(build)} className="btn btn-primary inline-mybuildspage-24">
                      <ShoppingCart size={15} /> Add Rig to Cart
                    </button>

                    <div className="inline-mybuildspage-25">
                      <button onClick={() => handleOpenInBuilder(build)} className="btn btn-secondary btn-sm" title="Open in Builder">
                        <Wrench size={13} /> Open
                      </button>

                      <button onClick={() => handleDuplicate(build)} className="btn btn-secondary btn-sm" title="Duplicate Build">
                        <Copy size={13} /> Clone
                      </button>

                      <button onClick={() => handleDelete(build.id)} className="btn btn-danger btn-sm" title="Delete Build">
                        <Trash2 size={13} /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>)}
          </div>}
      </div>
    </div>;
}
