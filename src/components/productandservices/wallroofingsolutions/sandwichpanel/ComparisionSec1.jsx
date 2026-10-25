import React from 'react'
import { comparisonListSandwich } from '../../../../Constants'
import { Container, Table } from 'reactstrap'

const ComparisionSec1 = () => {
    return (
        <section className="comparison-section">
            <Container>
                <div className="comparison-container">
                    <h2>Industries & Uses</h2>
                    <div className="comparison-container-box">
                        <Table responsive bordered hover>
                            <thead className="common-table-thead">
                                <tr>
                                    <th>Panel Type</th>
                                    <th>Best For</th>
                                    <th>Key Features</th>
                                </tr>
                            </thead>
                            <tbody className="common-table-tbody">
                                {comparisonListSandwich.map((compare, index) => (
                                    <tr key={index.id}>
                                        <td>
                                            <p>{compare.feature}</p>
                                        </td>
                                        <td>
                                            <p>{compare.prefab}</p>
                                        </td>
                                        <td>
                                            <p>{compare.exe}</p>
                                        </td>
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

export default ComparisionSec1