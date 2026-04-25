"use client";

import React, { useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
// Import Bootstrap CSS if not already in your layout.tsx

const initialMembers = [
  {
    id: 1,
    name: "Alden Goh",
    role: "Chem Eng & Biotech @ Cambridge",
    img: "https://.com/photo-1507003211169-0a1dd7228f2d?w=400",
  },
  {
    id: 2,
    name: "Chooi Je Qin",
    role: "AI Safety @ Oxford",
    img: "https://.com/photo-1438761681033-6461ffad8d80?w=400",
  },
  {
    id: 3,
    name: "Faye Jong",
    role: "Radiographer @ Brisbane",
    img: "https://.com/photo-1500648767791-00dcc994a43e?w=400",
  },
  {
    id: 4,
    name: "Henry Tan",
    role: "Stats & Econ @ Cornell",
    img: "https://.com/photo-1472099645785-5658abf4ff4e?w=400",
  },
];

export default function TeamPage() {
  const [members, setMembers] = useState(initialMembers);
  const [isAscending, setIsAscending] = useState(true);

  const handleSort = () => {
    const sorted = [...members].sort((a, b) => {
      return isAscending
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    });
    setMembers(sorted);
    setIsAscending(!isAscending);
  };

  return (
    <div className="!border-b-2 !border-slate-50/20" >
    
    <div className="flex justify-center content-center !mt-10"> 
         <h1 className="!text-4xl md:!text-6xl !font-bold !text-center ">
                <div className="bg-gradient-to-r from-stone-400  to-slate-300 bg-clip-text text-transparent">Board of Advisors</div> 
              </h1>
    </div>
      

        {/* Aesthetic Sort Button with !important overrides */}
      <Container >
        {/* Grid: 1 column on mobile (xs), 3 columns on large (lg) */}
        <Row xs={1} lg={3} className="!g-6">
          {members.map((member) => (
            <Col key={member.id} className="!mb-6">
              <Card className="!h-full !border-0 !shadow-md !rounded-2xl !overflow-hidden !transition-transform !duration-300 hover:!-translate-y-2">
                {/* Image Header */}
                <Card.Img
                  variant="top"
                  src={member.img}
                  className="!aspect-[4/3] !object-cover"
                />
                <Card.Body className="!p-6 !bg-white">
                  <Card.Title className="!text-xl !font-bold !text-gray-900 !mb-2">
                    {member.name}
                  </Card.Title>
                  <Card.Text className="!text-gray-500 !text-sm !leading-relaxed">
                    {member.role}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
}
