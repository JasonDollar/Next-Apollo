import React, { useState } from 'react'
import axios from 'axios'
import Link from 'next/link'

import PortfolioCard from '../../components/portfolios/PortfolioCard'

const fetchPortfolios = () => {
  const query = `
    query Portfolios {
      portfolios {
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
    .then(data => data.portfolios)
}

const graphCreatePortfolio = () => {
  // hardcoded data for testing
  const query = `
  mutation CreatePortfolio {
    createPortfolio(portfolio: {
      title: "New Job"
      company: "New Company"
      companyWebsite: "New Website"
      location: "New Location"
      jobTitle: "New Job Title"
      description: "New Desc"
      startDate: "12/12/2012"
      endDate: "14/11/2013"
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
    .then(data => data.createPortfolio)
}

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

const Portfolios = ({ data }) => {
  const [portfolios, setPortfolios] = useState(() => data.portfolios)

  const createPortfolio = async () => {
    const newPortfolio = await graphCreatePortfolio()
    setPortfolios([...portfolios, newPortfolio])
  }

  const updatePortfolio = async id => {
    const updatedPortfolio = await graphUpdatePortfolio(id)
    const index = portfolios.findIndex(p => p._id === id)
    const newPortfolios = portfolios.slice()
    newPortfolios[index] = updatedPortfolio
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
              <button className="btn btn-warning" onClick={() => updatePortfolio(item._id)}>Update</button>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}

Portfolios.getInitialProps = async () => {
  const portfolios = await fetchPortfolios()

  return { data: { portfolios } }
}



export default Portfolios
