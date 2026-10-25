import React from 'react'
import { Container, Table } from 'reactstrap'
import { comparisonListHomeKit } from '../../../../Constants'

const Comparison = () => {
  return (
    <section className="comparison-section">
                <Container>
                    <div className="comparison-container">
                        <h2>Where LGSF Works Best</h2>
                        <div className="comparison-container-box">
                            <Table responsive bordered hover>
                                <thead className="common-table-thead">
                                    <tr>
                                        <th>Application Type</th>
                                        <th>Use Cases</th>
                                    </tr>
                                </thead>
                                <tbody className="common-table-tbody">
                                    {comparisonListHomeKit.map((compare, index) => (
                                        <tr key={index.id}>
                                            <td>
                                                <p>{compare.feature}</p>
                                            </td>
                                            <td>
                                                <p>{compare.prefab}</p>
                                            </td>
                                            <td>
                                                <p>{compare.conventional}</p>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                            <p>
                                <strong>Service Zones: </strong>  Rajasthan, Gujarat, MP – especially Udaipur, Jaipur, Indore, and Ahmedabad.
                            </p>
                        </div>
                    </div>
                </Container>
            </section>  )
}

export default Comparison