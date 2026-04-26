'use client';

import React from 'react';

/* ── Design tokens ── */
const NAVY = '#1e3a8a';
const BLUE = '#3b82f6';
const SKY = '#bfdbfe';
const DARK = '#111827';
const MID = '#4b5563';
const MUTED = '#9ca3af';
const STRIP = '#f8fafc';
const BORD = '#e2e8f0';
const WHITE = '#ffffff';
const RED = '#dc2626';

const FONT = 'Arial, Helvetica, sans-serif';

/* ── Helpers ── */
function money(n) {
  const v = parseFloat(n) || 0;
  if (v <= 0) return '—';
  return '₹ ' + v.toLocaleString('en-IN');
}

function fmtDate(str, fallback) {
  if (!str) return fallback || '';
  try {
    return new Date(str).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'long', year: 'numeric',
    });
  } catch {
    return fallback || str;
  }
}

/* ═══════════════════════════════════════ */
export default function OfferPreview({ data }) {

  const basic = parseFloat(data.basicSalary) || 0;
  const hra = parseFloat(data.hra) || 0;
  const allow = parseFloat(data.allowances) || 0;
  const monthly = basic + hra + allow;
  const annual = monthly * 12;

  const today = new Date().toLocaleDateString('en-IN', {
    day: '2-digit', month: 'long', year: 'numeric'
  });

  const joiningStr = fmtDate(data.joiningDate, '[Joining Date]');
  const validStr = fmtDate(data.offerValidUntil, '[Valid Until]');

  const cName = data.companyName || 'DAXHIVE HQ PRIVATE LIMITED';
  const cAddr = data.companyAddress || '';
  const cWeb = data.companyWebsite || '';

  const PARA = {
    fontFamily: FONT,
    fontSize: '13px',
    lineHeight: '1.8',
    letterSpacing: '0.4px',
    wordSpacing: '1px',
    marginBottom: '14px',
    textAlign: 'justify',
  };

  return (
    <div style={{
      width: '794px',
      minHeight: '1123px',
      background: WHITE,
      padding: '48px 64px',
      fontFamily: FONT,
      letterSpacing: '0.3px',
      wordSpacing: '1px',
    }}>

      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>

        <div style={{ display: 'flex', gap: '12px' }}>
          <img src="/assets/logo.png" alt="logo"
            style={{ height: '50px' }}
            crossOrigin="anonymous"
          />

          <div>
            <div style={{
              fontWeight: '800',
              color: NAVY,
              fontSize: '16px',
              letterSpacing: '1px'
            }}>
              {cName}
            </div>

            <div style={{ fontSize: '11px', color: MID, lineHeight: '1.6' }}>
              {cAddr}
            </div>

            <div style={{ fontSize: '11px', color: BLUE }}>
              {cWeb}
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'right', fontSize: '12px' }}>
          <div><b>Date:</b> {today}</div>
          <div><b>Ref:</b> {data.refNumber}</div>
          <div><b>Emp ID:</b> {data.employeeId}</div>
        </div>
      </div>

      <hr style={{ margin: '15px 0' }} />

      {/* TITLE */}
      <h2 style={{
        textAlign: 'center',
        letterSpacing: '4px',
        color: NAVY
      }}>
        OFFER LETTER
      </h2>

      <p style={PARA}>
        Dear <b>{data.candidateName}</b>,
      </p>

      <p style={PARA}>
        We are delighted to offer you employment at <b>{cName}</b>.
        Your skills and experience will be a valuable addition to our team.
      </p>

      <p style={PARA}>
        You are offered the role of <b>{data.jobTitle}</b>.
        Your joining date will be <b>{joiningStr}</b>.
        This is a <b>{data.employmentType}</b> position.
      </p>

      {/* TABLE */}
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: '12px'
      }}>
        <thead>
          <tr style={{ background: NAVY, color: 'white' }}>
            <th style={{ padding: '10px', textAlign: 'left' }}>Component</th>
            <th style={{ padding: '10px', textAlign: 'right' }}>Monthly</th>
            <th style={{ padding: '10px', textAlign: 'right' }}>Annual</th>
          </tr>
        </thead>

        <tbody>
          {[
            ['Basic Salary', basic],
            ['HRA', hra],
            ['Allowances', allow]
          ].map(([label, val], i) => (
            <tr key={i} style={{ background: i % 2 ? STRIP : WHITE }}>
              <td style={{ padding: '8px' }}>{label}</td>
              <td style={{ padding: '8px', textAlign: 'right' }}>{money(val)}</td>
              <td style={{ padding: '8px', textAlign: 'right' }}>{money(val * 12)}</td>
            </tr>
          ))}

          <tr style={{ background: NAVY, color: 'white' }}>
            <td style={{ padding: '10px' }}>Total</td>
            <td style={{ padding: '10px', textAlign: 'right' }}>{money(monthly)}</td>
            <td style={{ padding: '10px', textAlign: 'right' }}>{money(annual)}</td>
          </tr>
        </tbody>
      </table>

      {/* TERMS */}
      <p style={PARA}>
        This offer is subject to company policies and verification processes.
        Please accept this offer before <b>{validStr}</b>.
      </p>

      {/* SIGNATURE */}
      <div style={{ marginTop: '50px', display: 'flex', justifyContent: 'space-between' }}>

        <div>
          <p>Sincerely,</p>
          <b>{data.hrName}</b><br />
          {data.hrDesignation}
        </div>

        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: '11px' }}>Authorized Signatory</p>

          {data.signatureUrl && (
            <img
              src={data.signatureUrl}
              style={{ height: '60px' }}
              crossOrigin="anonymous"
            />
          )}
        </div>

      </div>

    </div>
  );
}
