import { useState, useEffect } from "react";
import type {
  FilterOptions,
  Location,
  RestroomWithDistance,
  Review,
  Restroom,
  Issue,
} from "./types";
import { getCurrentLocation } from "./utils/geolocation";
import { applyFilters, addDistanceAndSort } from "./utils/filters";
import { sampleRestrooms } from "./data/sampleRestrooms";
import FilterChips from "./components/FilterChips";
import RestroomCard from "./components/RestroomCard";
import CompactRestroomCard from "./components/CompactRestroomCard";
import BottomSheet from "./components/BottomSheet";
import SidePanel from "./components/SidePanel";
import RestroomDetail from "./components/RestroomDetail";
import AddReviewForm from "./components/AddReviewForm";
import ReportIssueForm from "./components/ReportIssueForm";
import AddBathroomForm from "./components/AddBathroomForm";
import MapView from "./components/MapView";
import { rtdb, firebaseConfig } from "./firebase";
import {
  get as rtdbGet,
  ref as rtdbRef,
  push as rtdbPush,
  set as rtdbSet,
  update as rtdbUpdate,
  serverTimestamp as rtdbServerTimestamp,
} from "firebase/database";
import logo from "./assets/image.png";

const App = () => {
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({
    wheelchairAccessible: false,
    genderNeutral: false,
    wildcardFree: false,
    sortByDistance: true,
  });
  const [filteredRestrooms, setFilteredRestrooms] = useState<
    RestroomWithDistance[]
  >([]);
  const [selectedRestroom, setSelectedRestroom] =
    useState<RestroomWithDistance | null>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showReportIssueForm, setShowReportIssueForm] = useState(false);
  const [showAddBathroomForm, setShowAddBathroomForm] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [showListView, setShowListView] = useState(false);
  const [allRestrooms, setAllRestrooms] = useState<Restroom[]>(sampleRestrooms);
  const [isLoadingRestrooms, setIsLoadingRestrooms] = useState(false);

  // Get user location on mount
  useEffect(() => {
    getCurrentLocation()
      .then((location) => {
        setUserLocation(location);
        setLocationError(null);
        setIsLoadingLocation(false);
      })
      .catch((error) => {
        console.error("Location error:", error);
        setLocationError(
          "Unable to get your location. Please enable location services."
        );
        // Default to Northwestern campus center
        setUserLocation({
          latitude: 42.0551,
          longitude: -87.675,
        });
        setIsLoadingLocation(false);
      });
  }, []);

  // Load reviews on mount
  useEffect(() => {
    const loadReviews = async () => {
      try {
        const reviewsRef = rtdbRef(rtdb, "reviews");
        const snap = await rtdbGet(reviewsRef);
        const rtdbData = snap && snap.exists() ? snap.val() : null;

        const rtdbReviews: Review[] = [];
        if (rtdbData) {
          Object.keys(rtdbData).forEach((key) => {
            const item = rtdbData[key];
            rtdbReviews.push({
              id: key,
              userId: item.userId || "guest-user",
              restroomId: item.restroomId,
              userName: item.userName,
              rating: item.rating,
              comment: item.comment || "",
              createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
              flags: item.flags || 0,
            });
          });
        }

        // sort newest first
        rtdbReviews.sort((a, b) => +b.createdAt - +a.createdAt);
        setReviews(rtdbReviews);
      } catch (error) {
        console.error("Error loading reviews from RTDB:", error);
      }
    };

    loadReviews();
  }, []);

  // Load issues on mount
  useEffect(() => {
    const loadIssues = async () => {
      try {
        const issuesRef = rtdbRef(rtdb, "issues");
        const snap = await rtdbGet(issuesRef);
        const rtdbData = snap && snap.exists() ? snap.val() : null;

        const rtdbIssues: Issue[] = [];
        if (rtdbData) {
          Object.keys(rtdbData).forEach((key) => {
            const item = rtdbData[key];
            rtdbIssues.push({
              id: key,
              restroomId: item.restroomId,
              description: item.description,
              isResolved: item.isResolved || false,
              createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
            });
          });
        }

        // sort newest first
        rtdbIssues.sort((a, b) => +b.createdAt - +a.createdAt);
        setIssues(rtdbIssues);
      } catch (error) {
        console.error("Error loading issues from RTDB:", error);
      }
    };

    loadIssues();
  }, []);

  useEffect(() => {
    const loadRestrooms = async () => {
      setIsLoadingRestrooms(true);
      console.log(
        "Firebase projectId =",
        firebaseConfig.projectId,
        "databaseURL =",
        firebaseConfig.databaseURL
      );
      try {
        const listRef = rtdbRef(rtdb, "restrooms");
        const snap = await rtdbGet(listRef);
        const rtdbData = snap && snap.exists() ? snap.val() : null;

        const rtdbRestrooms: Restroom[] = [];
        if (rtdbData) {
          Object.keys(rtdbData).forEach((key) => {
            const item = rtdbData[key];
            rtdbRestrooms.push({
              id: key,
              name: item.name,
              buildingName: item.buildingName,
              floor: item.floor,
              location: item.location,
              isWheelchairAccessible: item.isWheelchairAccessible,
              isGenderNeutral: item.isGenderNeutral,
              requiresWildcard: item.requiresWildcard,
              photoUrls: item.photoUrls || [],
              accessibilityNotes: item.accessibilityNotes,
              status: item.status || "open",
              lastUpdated: item.lastUpdated
                ? new Date(item.lastUpdated)
                : new Date(),
            });
          });
        }

        console.log("RTDB: loaded restrooms count =", rtdbRestrooms.length);
        console.log(
          "RTDB restrooms:",
          rtdbRestrooms.map((r) => ({ id: r.id, name: r.name }))
        );

        setAllRestrooms(rtdbRestrooms);
      } catch (error) {
        console.error("Error loading restrooms from RTDB:", error);
        setAllRestrooms(sampleRestrooms);
      } finally {
        setIsLoadingRestrooms(false);
      }
    };

    loadRestrooms();
  }, []);

  // Filter and sort restrooms when location or filters change
  useEffect(() => {
    if (userLocation) {
      const filtered = applyFilters(allRestrooms, filters);
      const sorted = addDistanceAndSort(filtered, userLocation);
      setFilteredRestrooms(sorted);
    }
  }, [userLocation, filters, allRestrooms]);

  const handleReviewSubmit = (
    review: Omit<Review, "id" | "createdAt" | "flags">
  ) => {
    (async () => {
      const newReviewBase = {
        ...review,
        flags: 0,
      };

      try {
        const listRef = rtdbRef(rtdb, "reviews");
        const newRef = rtdbPush(listRef);

        await rtdbSet(newRef, {
          ...newReviewBase,
          createdAt: rtdbServerTimestamp(),
        });

        // optimistic local update with server key and local Date
        const optimistic: Review = {
          id: newRef.key || Date.now().toString(),
          userId: newReviewBase.userId || "guest-user",
          restroomId: newReviewBase.restroomId,
          userName: newReviewBase.userName,
          rating: newReviewBase.rating as Review["rating"],
          comment: newReviewBase.comment || "",
          createdAt: new Date(),
          flags: 0,
        };

        setReviews((prev) => [optimistic, ...prev]);
        setShowReviewForm(false);
      } catch (error) {
        console.error("RTDB write error (review):", error);
        alert("❌ Failed to save review to database. Please try again.");
      }
    })();
  };

  const handleIssueSubmit = (
    issue: Omit<Issue, "id" | "createdAt" | "isResolved">
  ) => {
    (async () => {
      const newIssueBase = {
        ...issue,
        isResolved: false,
      };

      try {
        const listRef = rtdbRef(rtdb, "issues");
        const newRef = rtdbPush(listRef);

        await rtdbSet(newRef, {
          ...newIssueBase,
          createdAt: rtdbServerTimestamp(),
        });

        // optimistic local update
        const optimistic: Issue = {
          id: newRef.key || Date.now().toString(),
          restroomId: newIssueBase.restroomId,
          description: newIssueBase.description,
          isResolved: false,
          createdAt: new Date(),
        };

        setIssues((prev) => [optimistic, ...prev]);
        setShowReportIssueForm(false);
        alert("✅ Issue reported successfully!");
      } catch (error) {
        console.error("RTDB write error (issue):", error);
        alert("❌ Failed to report issue. Please try again.");
      }
    })();
  };

  const handleResolveIssue = async (issueId: string) => {
    try {
      const issueRef = rtdbRef(rtdb, `issues/${issueId}`);
      await rtdbUpdate(issueRef, {
        isResolved: true,
      });

      // Optimistic update
      setIssues((prev) =>
        prev.map((issue) =>
          issue.id === issueId ? { ...issue, isResolved: true } : issue
        )
      );
    } catch (error) {
      console.error("Error resolving issue:", error);
      alert("❌ Failed to resolve issue. Please try again.");
    }
  };

  const handleBathroomSubmit = async (restroomData: {
    name: string;
    buildingName: string;
    floor: string;
    location: Location;
    isWheelchairAccessible: boolean;
    isGenderNeutral: boolean;
    requiresWildcard: boolean;
    accessibilityNotes?: string;
  }) => {
    try {
      const newRestroom = {
        ...restroomData,
        status: "open" as const,
        lastUpdated: new Date(),
        photoUrls: [],
      };
      try {
        const listRef = rtdbRef(rtdb, "restrooms");
        const newRef = rtdbPush(listRef);

        console.log("RTDB: writing restroom object:", {
          ...newRestroom,
          createdAt: "serverTimestamp",
        });

        await rtdbSet(newRef, {
          ...newRestroom,
          createdAt: rtdbServerTimestamp(),
        });

        console.log("RTDB: Restroom added with key", newRef.key);

        alert("✅ Restroom added successfully! Thank you for contributing!");
      } catch (rtdbError) {
        console.error("RTDB write error:", rtdbError);
        alert("❌ Failed to save restroom to database. Please try again.");
        throw rtdbError;
      }
    } catch (error) {
      console.error("Error adding restroom:", error);
      alert("❌ Failed to add restroom. Please try again.");
    }
  };

  const nearestRestroom = filteredRestrooms[0];
  const [showNearestBanner, setShowNearestBanner] = useState(true);

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden">
      {/* Compact Header */}
      <header className="bg-purple-600 text-white shadow-lg flex-shrink-0">
        <div className="px-4 py-2 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="FlushRush Logo"
              className="h-20 w-20 object-contain"
            />
            <div>
              <h1 className="text-xl font-bold">FlushRush</h1>
              <p className="text-xs text-purple-100">Northwestern Campus</p>
            </div>
          </div>
          <button
            onClick={() => setShowListView(!showListView)}
            className="bg-purple-700 hover:bg-purple-800 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            {showListView ? "🗺️ Map" : "📋 List"}
          </button>
        </div>
      </header>

      {/* Main Content - Full height */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Filters - Collapsible */}
        <div className="bg-white shadow-md flex-shrink-0 border-b border-gray-200">
          <FilterChips filters={filters} onChange={setFilters} />
        </div>

        {/* Location Status Banner */}
        {(isLoadingLocation || locationError) && (
          <div className="flex-shrink-0">
            {isLoadingLocation && (
              <div className="bg-blue-50 border-b-2 border-blue-300 px-4 py-2 text-center">
                <p className="text-blue-800 text-sm">
                  📍 Getting your location...
                </p>
              </div>
            )}
            {locationError && (
              <div className="bg-yellow-50 border-b-2 border-yellow-300 px-4 py-2">
                <p className="text-yellow-800 text-xs">{locationError}</p>
              </div>
            )}
          </div>
        )}

        {/* Map or List View - Takes remaining space */}
        {!showListView && userLocation ? (
          <div
            className="flex-1 flex overflow-hidden"
            style={{ minHeight: "500px" }}
          >
            {/* Map Section - 65% of width */}
            <div className="w-[65%] relative h-full">
              <MapView
                userLocation={userLocation}
                restrooms={filteredRestrooms}
                onRestroomClick={setSelectedRestroom}
                selectedRestroom={selectedRestroom}
              />

              {/* Floating Nearest Restroom Card - More compact */}
              {nearestRestroom && !isLoadingLocation && showNearestBanner && (
                <div className="absolute top-3 left-3 right-3 bg-white rounded-lg shadow-xl p-3 z-[1000] border-2 border-purple-400">
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-purple-600 font-bold mb-0.5">
                        🎯 NEAREST
                      </div>
                      <h3 className="font-bold text-sm truncate">
                        {nearestRestroom.buildingName}
                      </h3>
                      <p className="text-xs text-gray-600 truncate">
                        {nearestRestroom.floor}
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-xs">
                        <span className="text-purple-600 font-semibold">
                          {nearestRestroom.distance < 1000
                            ? `${Math.round(nearestRestroom.distance)}m`
                            : `${(nearestRestroom.distance / 1000).toFixed(
                              1
                            )}km`}
                        </span>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-600">
                          {nearestRestroom.estimatedWalkTime} min
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <button
                        onClick={() => setSelectedRestroom(nearestRestroom)}
                        className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-3 py-2 rounded-lg text-xs whitespace-nowrap transition-colors"
                      >
                        View
                      </button>
                      <button
                        onClick={() => setShowNearestBanner(false)}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold px-2 py-2 rounded-lg text-xs transition-colors flex items-center justify-center"
                        aria-label="Close banner"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bathroom List Section - 35% of width */}
            <div className="w-[35%] bg-gradient-to-b from-gray-50 to-white border-l-2 border-gray-200 overflow-hidden flex flex-col">
              <div className="px-4 py-3 bg-white border-b border-gray-200 flex-shrink-0">
                <h2 className="text-sm font-bold text-gray-900">
                  📍 Nearby Restrooms ({filteredRestrooms.length})
                </h2>
              </div>
              <div className="flex-1 overflow-y-auto px-3 py-3">
                {filteredRestrooms.length === 0 ? (
                  <div className="bg-gray-50 rounded-lg p-6 text-center">
                    <p className="text-gray-600 text-sm mb-1">
                      No restrooms match your filters
                    </p>
                    <p className="text-gray-500 text-xs">
                      Try adjusting your settings
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredRestrooms.slice(0, 20).map((restroom) => (
                      <CompactRestroomCard
                        key={restroom.id}
                        restroom={restroom}
                        onClick={() => setSelectedRestroom(restroom)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-4 py-4">
            {/* Full List View */}
            <div className="max-w-4xl mx-auto">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                {filteredRestrooms.length === 0
                  ? "No restrooms found"
                  : `${filteredRestrooms.length} Restrooms`}
              </h2>
              {filteredRestrooms.length === 0 ? (
                <div className="bg-gray-50 rounded-xl p-8 text-center">
                  <p className="text-gray-600 mb-2">
                    No restrooms match your filters
                  </p>
                  <p className="text-gray-500 text-sm">
                    Try adjusting your filter settings
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredRestrooms.map((restroom) => (
                    <RestroomCard
                      key={restroom.id}
                      restroom={restroom}
                      onClick={() => setSelectedRestroom(restroom)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Restroom Detail Side Panel (for map view) */}
      {!showListView && (
        <SidePanel
          isOpen={selectedRestroom !== null && !showReviewForm && !showReportIssueForm}
          onClose={() => setSelectedRestroom(null)}
        >
          {selectedRestroom && (
            <RestroomDetail
              restroom={selectedRestroom}
              reviews={reviews.filter(
                (r) => r.restroomId === selectedRestroom.id
              )}
              issues={issues.filter((i) => i.restroomId === selectedRestroom.id)}
              onClose={() => setSelectedRestroom(null)}
              onAddReview={() => setShowReviewForm(true)}
              onReportIssue={() => setShowReportIssueForm(true)}
              onResolveIssue={handleResolveIssue}
            />
          )}
        </SidePanel>
      )}

      {/* Restroom Detail Bottom Sheet (for list view) */}
      {showListView && (
        <BottomSheet
          isOpen={selectedRestroom !== null && !showReviewForm && !showReportIssueForm}
          onClose={() => setSelectedRestroom(null)}
        >
          {selectedRestroom && (
            <RestroomDetail
              restroom={selectedRestroom}
              reviews={reviews.filter(
                (r) => r.restroomId === selectedRestroom.id
              )}
              issues={issues.filter((i) => i.restroomId === selectedRestroom.id)}
              onClose={() => setSelectedRestroom(null)}
              onAddReview={() => setShowReviewForm(true)}
              onReportIssue={() => setShowReportIssueForm(true)}
              onResolveIssue={handleResolveIssue}
            />
          )}
        </BottomSheet>
      )}

      {/* Add Review Bottom Sheet */}
      <BottomSheet
        isOpen={showReviewForm}
        onClose={() => setShowReviewForm(false)}
        title="Add Review"
      >
        {selectedRestroom && (
          <AddReviewForm
            restroomId={selectedRestroom.id}
            onSubmit={handleReviewSubmit}
            onCancel={() => setShowReviewForm(false)}
          />
        )}
      </BottomSheet>

      {/* Report Issue Bottom Sheet */}
      <BottomSheet
        isOpen={showReportIssueForm}
        onClose={() => setShowReportIssueForm(false)}
        title="Report an Issue"
      >
        {selectedRestroom && (
          <ReportIssueForm
            restroomId={selectedRestroom.id}
            onSubmit={handleIssueSubmit}
            onCancel={() => setShowReportIssueForm(false)}
          />
        )}
      </BottomSheet>

      {/* Add Bathroom Bottom Sheet */}
      <BottomSheet
        isOpen={showAddBathroomForm}
        onClose={() => setShowAddBathroomForm(false)}
        title="Add New Restroom"
      >
        <AddBathroomForm
          userLocation={userLocation}
          onSubmit={handleBathroomSubmit}
          onCancel={() => setShowAddBathroomForm(false)}
        />
      </BottomSheet>

      {/* Floating Add Button */}
      <button
        onClick={() => setShowAddBathroomForm(true)}
        className="fixed bottom-6 right-6 bg-purple-600 hover:bg-purple-700 text-white rounded-full w-16 h-16 shadow-2xl flex items-center justify-center text-3xl transition-all duration-200 hover:scale-110 z-[9000]"
        aria-label="Add new restroom"
        title="Add a restroom"
      >
        +
      </button>

      {/* Loading indicator for restrooms */}
      {isLoadingRestrooms && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded-lg shadow-lg z-[9000] border-2 border-purple-400">
          <p className="text-sm text-purple-600 font-medium">
            Loading restrooms...
          </p>
        </div>
      )}
    </div>
  );
};

export default App;
