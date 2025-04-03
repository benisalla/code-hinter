import { Label } from 'src/components/label';
import { ROLES } from 'src/components/Restrected';
import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor width="100%" height="100%" src={`/assets/icons/navbar/${name}.svg`} />
);

export interface INavData {
  title: string;
  path: string;
  icon: React.ReactNode;
  restrected?: ROLES;
}

export const navData:INavData[] = [
  {
    title: 'Exerices',
    path: '/',
    icon: icon('ic-exercise'),
  },
  {
    title: 'New Exercise',
    path: '/new-exercise',
    icon: icon('ic-cart'),
    restrected: ROLES.prof
  },
  {
    title: 'Students',
    path: '/students',
    icon: icon('ic-cart'),
    restrected: ROLES.prof
  },
  // {
  //   title: 'Blog',
  //   path: '/blog',
  //   icon: icon('ic-blog'),
  // },
  // {
  //   title: 'Sign in',
  //   path: '/sign-in',
  //   icon: icon('ic-lock'),
  // },
  // {
  //   title: 'Not found',
  //   path: '/404',
  //   icon: icon('ic-disabled'),
  // },
];
