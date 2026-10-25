import React from 'react'
import { Container, Table } from 'reactstrap'
import { comparisonListDiyPreFabKits } from '../../../Constants'

const Comparison = () => {
    return (
        <section className="comparison-section">
            <Container>
                <div className="comparison-container">
                    <h2>Where Our Prefab Structures Are Used</h2>
                    <h2>DIY PreFab’s prefabs are powering progress across India:</h2>
                    <div className="comparison-container-box">
                        <Table responsive bordered hover>
                            <thead className="common-table-thead">
                                <tr>
                                    <th>Sector</th>
                                    <th>Use Case Examples</th>
                                </tr>
                            </thead>
                            <tbody className="common-table-tbody">
                                {comparisonListDiyPreFabKits.map((compare, index) => (
                                    <tr key={index}>
                                        <td>
                                            <p>{compare.feature}</p>
                                        </td>
                                        <td>
                                            <p>{compare.prefab}</p>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                        <p>
                            <strong>Target Regions: </strong> Rajasthan, Gujarat, Madhya
                            Pradesh, Udaipur, Indore, Ahmedabad.
                        </p>
                    </div>
                </div>
            </Container>
        </section>
    )
}

export default Comparison