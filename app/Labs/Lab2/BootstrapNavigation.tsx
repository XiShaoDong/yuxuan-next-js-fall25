import React from 'react'
import { Button, Card, CardBody, CardImg, CardText, CardTitle } from 'react-bootstrap'

function BootstrapNavigation() {
    return (
        <div id="wd-css-navigating-with-cards">
            <h2> Cards </h2>
            <Card style={{ width: "18rem" }}>
                <CardImg variant="top" src="/images/teslabot.jpg" />
                <CardBody>
                    <CardTitle>Stacking Starship</CardTitle>
                    <CardText>
                        Stacking the most powerful rocket in history. Mars or bust!
                    </CardText>
                    <Button variant="primary">Boldly Go</Button>
                </CardBody>
            </Card>
        </div>

    )
}

export default BootstrapNavigation