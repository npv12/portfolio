import { Link } from "react-scroll";

type TNavProps = {
  navlink: string;
  children?: React.ReactNode;
  classname?: string;
};

export default function NavLink(props: TNavProps) {
  return (
    <div className={`${props.classname}`}>
      <Link
        activeClass="active"
        to={props.navlink}
        spy={true}
        smooth={true}
        duration={500}
      >
        {props.children}
      </Link>
    </div>
  );
}
