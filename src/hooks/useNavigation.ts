import { useNavigate } from 'react-router-dom';

export function useNavigation() {
  const navigate = useNavigate();

  const goToAdmin = () => navigate('/admin');

  const scrollTo = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return { goToAdmin, scrollTo };
}
