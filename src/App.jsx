import { useCallback, useState } from 'react';
import PhoneShell from './components/PhoneShell.jsx';
import TransitionOverlay from './components/TransitionOverlay.jsx';
import AgentInputPage, { getDefaultPlanningContent } from './pages/AgentInputPage.jsx';
import BookingPage from './pages/BookingPage.jsx';
import HomePage from './pages/HomePage.jsx';
import ItineraryPage from './pages/ItineraryPage.jsx';
import LandingPage from './pages/LandingPage.jsx';
import PlanningPage from './pages/PlanningPage.jsx';
import PlansPage from './pages/PlansPage.jsx';

const screens = {
  home: 'home',
  input: 'input',
  planning: 'planning',
  plans: 'plans',
  booking: 'booking',
  itinerary: 'itinerary',
};

export default function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [screen, setScreen] = useState(screens.home);
  const [request, setRequest] = useState(() => getDefaultPlanningContent([]).defaultInput);
  const [requestEdited, setRequestEdited] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedFallbackRestaurant, setSelectedFallbackRestaurant] = useState(null);
  const [selectedFriends, setSelectedFriends] = useState([]);

  const goHome = () => setScreen(screens.home);
  const goInput = () => {
    if (!requestEdited) {
      setRequest(getDefaultPlanningContent(selectedFriends).defaultInput);
    }
    setScreen(screens.input);
  };
  const goPlans = useCallback(() => setScreen(screens.plans), []);
  const handleRequestChange = useCallback((nextRequest) => {
    setRequest(nextRequest);
    setRequestEdited(true);
  }, []);

  const enterDemo = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    window.setTimeout(() => {
      setShowLanding(false);
    }, 980);
    window.setTimeout(() => {
      setIsTransitioning(false);
    }, 1320);
  };

  const demo = (
    <PhoneShell>
      {screen === screens.home && (
        <HomePage
          onStart={goInput}
          selectedFriends={selectedFriends}
          onFriendsChange={setSelectedFriends}
        />
      )}
      {screen === screens.input && (
        <AgentInputPage
          value={request}
          onChange={handleRequestChange}
          onBack={goHome}
          onPlan={() => setScreen(screens.planning)}
          selectedFriends={selectedFriends}
        />
      )}
      {screen === screens.planning && (
        <PlanningPage request={request} selectedFriends={selectedFriends} onBack={goInput} onDone={goPlans} />
      )}
      {screen === screens.plans && (
        <PlansPage
          request={request}
          selectedFriends={selectedFriends}
          onBack={goInput}
          onConfirm={(plan) => {
            setSelectedPlan(plan);
            setSelectedFallbackRestaurant(null);
            setScreen(screens.booking);
          }}
        />
      )}
      {screen === screens.booking && (
        <BookingPage
          plan={selectedPlan}
          selectedFriends={selectedFriends}
          onBack={() => setScreen(screens.plans)}
          onRestaurantSelected={setSelectedFallbackRestaurant}
          onFinish={() => setScreen(screens.itinerary)}
        />
      )}
      {screen === screens.itinerary && (
        <ItineraryPage
          plan={selectedPlan}
          selectedFriends={selectedFriends}
          selectedRestaurant={selectedFallbackRestaurant}
          onBack={() => setScreen(screens.booking)}
          onRestart={() => {
            setSelectedPlan(null);
            setSelectedFallbackRestaurant(null);
            setScreen(screens.input);
          }}
        />
      )}
    </PhoneShell>
  );

  return (
    <>
      {showLanding ? (
        <LandingPage onEnter={enterDemo} isTransitioning={isTransitioning} />
      ) : (
        <div className="demo-enter">{demo}</div>
      )}
      <TransitionOverlay active={isTransitioning} />
    </>
  );
}
