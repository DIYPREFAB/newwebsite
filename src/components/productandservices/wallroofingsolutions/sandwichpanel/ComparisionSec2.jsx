import React from 'react'
import { comparisonList2Sandwich } from '../../../../Constants'
import { Container, Table } from 'reactstrap'

const ComparisionSec2 = () => {
    return (
        <section className="comparison-section">
            <Container>
                <div className="comparison-container">
                    <h2>Panel Types We Offer</h2>
                    <div className="comparison-container-box">
                        <Table responsive bordered hover>
                            <thead className="common-table-thead">
                                <tr>
                                    <th>Sector</th>
                                    <th>Applications</th>
                                </tr>
                            </thead>
                            <tbody className="common-table-tbody">
                                {comparisonList2Sandwich.map((compare, index) => (
                                    <tr key={index.id}>
                                        <td>
                                            <p>{compare.feature}</p>
                                        </td>
                                        <td>
                                            <p>{compare.prefab}</p>
                                        </td>
                                        {/* <td>
                               <p>{compare.exe}</p>
                             </td> */}
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </div>
            </Container>
        </section>
    )
}

export default ComparisionSec2