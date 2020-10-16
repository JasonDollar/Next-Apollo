import React, { useState } from 'react'
import Link from 'next/link'
import { getDataFromTree } from '@apollo/react-ssr'
import withApollo from '../../hoc/withApollo'

import {   
  useGetPortfolios,
  useUpdatePortfolio,
  useDeletePortfolio,
  useCreatePortfolio, 
} from '../../apollo/actions'

import PortfolioCard from '../../components/portfolios/PortfolioCard'



const Portfolios = () => {
  const [portfolios, setPortfolios] = useState([])
  const { data } = useGetPortfolios()
  const [updatePortfolio] = useUpdatePortfolio()
  const [deletePortfolio] = useDeletePortfolio()
  const [createPortfolio] = useCreatePortfolio()
  

// eslint-disable-next-line no-use-before-define
  if (data?.portfolios.length > 0 && (portfolios.length === 0 || data.portfolios.length !== portfolios.length)) {
    setPortfolios(data.portfolios)
  }


  
  return (
    <>
      <section className="section-title">
        <div className="px-2">
          <div className="pt-5 pb-4">
            <h1>Portfolios</h1>
          </div> 
        </div>
        <button
          className="btn btn-primary"
          onClick={createPortfolio}
        >Create portfolio
        </button>
      </section>
      <section className="pb-5">
        <div className="row">
          {portfolios.map(item => (
            <div key={item._id} className="col-md-4">
              <Link 
                // href - link to the next.js page, as - link as visible in the browser 
                href="/portfolios/[id]"
                as={`/portfolios/${item._id}`}
              >
                <a className="card-link">
                  <PortfolioCard portfolio={item} />
                </a>
              </Link>
              <button 
                className="btn btn-warning"
                onClick={() => updatePortfolio({ variables: { id: item._id } })}
              >Update
              </button>
              <button
                onClick={() => deletePortfolio({ variables: { id: item._id } })}
                className="btn btn-danger"
              >
                Delete Portfolio
              </button>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}



export default withApollo(Portfolios, { getDataFromTree })
