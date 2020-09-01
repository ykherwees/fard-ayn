import React from "react"
import { Link, StaticQuery, graphql } from "gatsby"
import { RiMenu3Line, RiCloseLine } from 'react-icons/ri';

const MenuItems = [
  {
    path: "/",
    title: "Home"
  },
  {
    path: "/about",
    title: "About"
  },
  {
    path: "/blog",
    title: "Blog"
  },
  {
    path: "/contact",
    title: "Contact"
  },
]

const ListLink = (props) => (<li><Link to={props.to}>{props.children}</Link></li>)


class Navigation extends React.Component {
  constructor(props) {
    super(props)
    this.state = {showMenu: false}

    this.handleToggleClick = this.handleToggleClick.bind(this);
  }

  handleToggleClick() {
    this.setState(state => ({      
      showMenu: !state.showMenu    
    }))
  }

  render () {
    const topics = <StaticQuery 
      query={graphql`
        query {
          allMarkdownRemark(
            sort: { order: DESC, fields: [frontmatter___date] }
            filter: { frontmatter: { template: { eq: "topic-page" } } }
            limit: 6
          ) {
            edges {
              node {
                id
                excerpt(pruneLength: 250)
                frontmatter {
                  date(formatString: "MMMM DD, YYYY")
                  slug
                  title
                  featuredImage {
                    childImageSharp {
                      fluid(maxWidth: 540, maxHeight: 360, quality: 80) {
                        ...GatsbyImageSharpFluid
                        ...GatsbyImageSharpFluidLimitPresentationSize
                      }
                    }
                  }
                }
              }
            }
          }
        }`
      }

      render={ data => {
          return data.allMarkdownRemark.edges
            .filter(edge => !!edge.node.frontmatter.date)
            .map((edge, index) =>
              <ListLink key={index + MenuItems.length} to={edge.node.slug}>{edge.node.formatter.title}</ListLink>
          )
        } 
      }
    />

    const listMenuItems = MenuItems.map((menuItem, index) => 
      <ListLink key={index} to={menuItem.path}>{menuItem.title}</ListLink>
    )

    const listItems = listMenuItems.concat(topics)
    return (
      <nav className="site-navigation">
        <button onClick={this.handleToggleClick} className={"menu-trigger" + (this.state.showMenu ? " is-active" : "")}>
          <div className="icon-menu-line"><RiMenu3Line/></div>
          <div className="icon-menu-close"><RiCloseLine/></div>
        </button>
        <ul>
          {listItems}
        </ul>
      </nav>
    )
  }
}

export default Navigation
