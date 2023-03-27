import React from "react"
import Logo from "../../assets/images/trivia.png";



const Footer = () => <footer className="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top">
    <div className="justify-content-between container p-2">

   
    <div className="col-md-4 d-flex align-items-center">
        <a href="/" className="mb-3 me-2 mb-md-0 text-muted text-decoration-none lh-1">
            <img className='hm-50px' src={Logo} />
        </a>
        <span className="mb-3 mb-md-0 text-muted">© 2023 Marek Vaníček</span>
    </div>

    <ul className="nav col-md-4 justify-content-end list-unstyled d-flex">
        {/* <li className="ms-3"><a className="text-muted" href="#"><svg className="bi" width="24" height="24"><use href="#twitter"></use></svg></a></li>
        <li className="ms-3"><a className="text-muted" href="#"><svg className="bi" width="24" height="24"><use xlink:href="#instagram"></use></svg></a></li>
        <li className="ms-3"><a className="text-muted" href="#"><svg className="bi" width="24" height="24"><use xlink:href="#facebook"></use></svg></a></li> */}
    </ul>
    </div>
</footer>

export default Footer