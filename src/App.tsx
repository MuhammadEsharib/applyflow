import { AppRouter } from './app/routes';
import { CommandPalette } from './components/shared/CommandPalette';
import { motion } from 'framer-motion';
import { pageTransition, pageTransitionConfig } from './lib/motion';

function App() {
  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransitionConfig}
      className="min-h-screen bg-white"
    >
      <AppRouter />
      <CommandPalette />
    </motion.div>
  );
}

export default App;