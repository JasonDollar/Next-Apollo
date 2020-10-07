const data = {
  portfolios: [
    {
      _id: 'adsf32rfasrf23',
      title: 'Job in Netcentric',
      company: 'Netcentric',
      companyWebsite: 'www.google.com',
      location: 'Spain, Barcelona',
      jobTitle: 'Engineer',
      description: 'Doing something, programing....',
      startDate: '01/01/2014',
      endDate: '01/01/2016',
    },
    {
      _id: 'da789ad1',
      title: 'Job in Siemens',
      company: 'Siemens',
      companyWebsite: 'www.google.com',
      location: 'Slovakia, Kosice',
      jobTitle: 'Software Engineer',
      description: 'Responsoble for parsing framework for JSON medical data.',
      startDate: '01/01/2011',
      endDate: '01/01/2013',
    },
    {
      _id: 'sadcxv9',
      title: 'Work in USA',
      company: 'WhoKnows',
      companyWebsite: 'www.google.com',
      location: 'USA, Montana',
      jobTitle: 'Housekeeping',
      description: 'So much responsibility....Overloaaaaaad',
      startDate: '01/01/2010',
      endDate: '01/01/2011',
    },
  ],
}

exports.portfolioQueries = {
  hello: () => 'Hello World!',
  portfolio: (root, args) => {
    const portfolio = data.portfolios.find(item => item._id === args.id)
    return portfolio
  },
  portfolios: () => data.portfolios,
}

exports.portfolioMutations = {
  createPortfolio: async (root, { portfolio }) => {
    const _id = await require('crypto').randomBytes(10).toString('hex')
    const newPortfolio = { ...portfolio, _id }
    
    data.portfolios.push(newPortfolio)
    return newPortfolio
  },
  updatePortfolio: (root, { id, input }) => {
    const index = data.portfolios.findIndex(item => item._id === id)
    if (index < 0) return null
    const oldPortfolio = data.portfolios[index]
    const updatedPortfolio = {
      ...oldPortfolio,
      ...input,
    }
    data.portfolios[index] = updatedPortfolio
    return updatedPortfolio
  },
}