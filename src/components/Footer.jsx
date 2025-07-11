import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="mx-auto w-full max-w-container px-4 sm:px-6 lg:px-8">
    <div className="border-t border-slate-900/5 py-10">
<div class="ml-4 flex justify-center lg:ml-0">
                <Link to="/">
                  <img
                    alt=""
                    src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
                    className="h-8 w-auto"
                  />
                </Link>
              </div>
        <p className="mt-5 text-center text-sm leading-6 text-slate-500">© 2025 Made with love by Dilip Singh Sisodiya</p>
        <div className="mt-8 flex items-center justify-center space-x-4 text-sm font-semibold leading-6 text-slate-700"><a
                href="#">Privacy policy</a>
            <div className="h-4 w-px bg-slate-500/20"></div><a href="#">Changelog</a>
        </div>
    </div>
</footer>
  )
}

export default Footer