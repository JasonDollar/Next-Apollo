import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Link from 'next/link'
import { useQuery, useMutation } from '@apollo/client'
import { getDataFromTree } from '@apollo/react-ssr'
import withApollo from '../../hoc/withApollo'

import { GET_PORTFOLIOS, CREATE_PORTFOLIO, GET_PORTFOLIO } from '../../apollo/queries'

import PortfolioCard from '../../components/portfolios/PortfolioCard'


const graphUpdatePortfolio = id => {
  const query = `
    mutation UpdatePortfolio {
      updatePortfolio(id: "${id}",input: {
        title: "UPDATE Job"
        company: "UPDATE Company"
        companyWebsite: "UPDATE Website"
        location: "UPDATE Location"
        jobTitle: "UPDATE Job Title"
        description: "UPDATE Desc"
        startDate: "12/12/2012 UPDATE"
        endDate: "14/11/2013 UPDATE"
      }) {
        _id,
        title,
        company,
        companyWebsite
        location
        jobTitle
        description
        startDate
        endDate
      }
    }`
  return axios.post('http://localhost:3000/graphql', { query })
    .then(({ data: graph }) => graph.data)
    .then(data => data.updatePortfolio)
}

const graphDeletePortfolio = id => {
  const query = `
    mutation DeletePortfolio {
      deletePortfolio(id: "${id}")
    }
  `

  return axios.post('http://localhost:3000/graphql', { query })
    .then(({ data: graph }) => graph.data)
    .then(data => data.deletePortfolio)
}

const Portfolios = () => {
  const [portfolios, setPortfolios] = useState([])
  const { loading, error, data } = useQuery(GET_PORTFOLIOS)
  const [createPortfolio, { data: dataC }] = useMutation(CREATE_PORTFOLIO, {
    update: (cache, { data: { createPortfolio } }) => {
      console.log(createPortfolio)
      const { portfolios } = cache.readQuery({ query: GET_PORTFOLIOS })
      console.log(portfolios)
      cache.writeQuery({ query: GET_PORTFOLIOS, data: { portfolios: [...portfolios, createPortfolio] } })
    },
  })
  


  if (data?.portfolios.length > 0 && (portfolios.length === 0 || data.portfolios.length !== portfolios.length)) {
    setPortfolios(data.portfolios)
  }

  // if (loading) return <div>Loading</div>
  // if (error) return <div>Error</div>



  const updatePortfolio = async id => {
    const updatedPortfolio = await graphUpdatePortfolio(id)
    const index = portfolios.findIndex(p => p._id === id)
    const newPortfolios = portfolios.slice()
    newPortfolios[index] = updatedPortfolio
    setPortfolios(newPortfolios)
  }

  const deletePortfolio = async id => {
    const deletedId = await graphDeletePortfolio(id)
    const index = portfolios.findIndex(p => p._id === deletedId)
    const newPortfolios = portfolios.slice()
    newPortfolios.splice(index, 1)
    setPortfolios(newPortfolios)
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
                onClick={() => updatePortfolio(item._id)}
              >Update
              </button>
              <button
                onClick={() => deletePortfolio(item._id)}
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
