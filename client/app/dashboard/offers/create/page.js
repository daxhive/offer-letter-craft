'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '../../../../lib/api';
import OfferPreview from '../../../../components/OfferPreview';
import {
  ArrowLeft, Send, Save, Download, Building2, User,
  Briefcase, IndianRupee, UserCheck, ChevronDown, ChevronUp,
  AlertCircle, CheckCircle, Loader2, RefreshCw,
} from 'lucide-react';

/* ── lazy PDF libs ── */
let _hc = null;
let _jp = null;
async function getPdfLibs() {
  if (!_hc) _hc = (await import('html2canvas')).default;
  if (!_jp) _jp = (await import('jspdf')).default;
  return { html2canvas: _hc, jsPDF: _jp };
}

/* ── helpers ── */
const mkRef   = () => `REF-${Date.now().toString().slice(-6)}`;
const mkEmpId = () => `EMP-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
const iCls    = (err) =>
  `w-full px-3 py-2.5 rounded-xl border text-sm text-gray-800 placeholder-gray-400 ` +
  `bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 ` +
  `focus:border-transparent transition-all ` +
  (err ? 'border-red-400 bg-red-50' : 'border-gray-200');

/* ── collapsible section ── */
function Section({ title, icon: Icon, accent = '#2563eb', children }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-3">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: `${accent}20` }}>
            <Icon className="w-4 h-4" style={{ color: accent }} />
          </div>
          <span className="font-semibold text-gray-800 text-sm">{title}</span>
        </div>
        {open
          ? <ChevronUp className="w-4 h-4 text-gray-400" />
          : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>
      {open && <div className="px-5 pb-5 pt-1 space-y-3">{children}</div>}
    </div>
  );
}

/* ── field label ── */
function Field({ label, err, children }) {
  return (
    <div>
      <label className="flex items-center gap-1 text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
        {label}
        {err && <span className="text-red-500 font-normal normal-case tracking-normal ml-1">— {err}</span>}
      </label>
      {children}
    </div>
  );
}

/* ═════════════════════════════════════════
   MAIN PAGE
═════════════════════════════════════════ */
export default function CreateOfferPage() {
  const router     = useRouter();
  const previewRef = useRef(null);

  const [form, setForm] = useState({
    /* Company — pre-filled with DAXHIVE */
    companyName:     'DAXHIVE HQ PRIVATE LIMITED',
    companyAddress:  'Oxford Towers, 139/88 HAL Old Airport Rd,\nHAL 2nd Stage, Bangalore,\nBangalore North, Karnataka \u2014 560008',
    companyWebsite:  'https://www.daxhive.com/',
    refNumber:       mkRef(),
    employeeId:      mkEmpId(),
    offerValidUntil: '',
    /* Candidate */
    candidateName:   '',
    candidateEmail:  '',
    /* Job */
    jobTitle:        '',
    officeAddress:   '',
    joiningDate:     '',
    employmentType:  'Full-Time',
    /* Salary (monthly ₹) */
    basicSalary:     '',
    hra:             '',
    allowances:      '',
    /* HR */
    hrName:          '',
    hrDesignation:   'HR Manager',
    /* Signature */
    signatureUrl:    null,
  });

  const [errs,  setErrs]  = useState({});
  const [busy,  setBusy]  = useState({ save: false, send: false, pdf: false });
  const [toast, setToast] = useState({ type: '', msg: '' });

  /* field change */
  const set = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errs[name]) setErrs((p) => ({ ...p, [name]: '' }));
  };

  /* signature upload */
  const onSig = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setForm((p) => ({ ...p, signatureUrl: URL.createObjectURL(file) }));
  };

  /* validation */
  const validate = () => {
    const e = {};
    if (!form.candidateName.trim())  e.candidateName  = 'Required';
    if (!form.candidateEmail.trim()) e.candidateEmail = 'Required';
    if (!form.jobTitle.trim())       e.jobTitle       = 'Required';
    if (!form.joiningDate)           e.joiningDate    = 'Required';
    if (!form.basicSalary)           e.basicSalary    = 'Required';
    setErrs(e);
    return Object.keys(e).length === 0;
  };

  /* derived salary */
  const basic   = parseFloat(form.basicSalary) || 0;
  const hraVal  = parseFloat(form.hra)          || 0;
  const allowV  = parseFloat(form.allowances)   || 0;
  const monthly = basic + hraVal + allowV;
  const annual  = monthly * 12;
  const fmtInr  = (n) => n > 0 ? `\u20B9${n.toLocaleString('en-IN')}` : '\u2014';

  /* PDF download */
  const downloadPDF = async () => {
    setBusy((p) => ({ ...p, pdf: true }));
    setToast({ type: '', msg: '' });
    try {
      const el = previewRef.current;
      const { html2canvas, jsPDF } = await getPdfLibs();
      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        allowTaint: false,
      });
      const img = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const w   = 210;
      const h   = (canvas.height * w) / canvas.width;
      /* if letter is longer than one A4 page, add extra pages */
      if (h <= 297) {
        pdf.addImage(img, 'PNG', 0, 0, w, h);
      } else {
        let yOffset = 0;
        while (yOffset < h) {
          if (yOffset > 0) pdf.addPage();
          pdf.addImage(img, 'PNG', 0, -yOffset, w, h);
          yOffset += 297;
        }
      }
      pdf.save(`offer-letter-${form.candidateName || 'draft'}.pdf`);
    } catch {
      setToast({ type: 'error', msg: 'PDF generation failed. Please try again.' });
    } finally {
      setBusy((p) => ({ ...p, pdf: false }));
    }
  };

  /* save / send */
  const submit = async (shouldSend) => {
    if (!validate()) return;
    const key = shouldSend ? 'send' : 'save';
    setBusy((p) => ({ ...p, [key]: true }));
    setToast({ type: '', msg: '' });
    try {
      const { data } = await api.post('/offers', {
        candidateName:  form.candidateName,
        candidateEmail: form.candidateEmail,
        jobTitle:       form.jobTitle,
        joiningDate:    form.joiningDate,
        salary:         annual,
        companyName:    form.companyName,
        employmentType: form.employmentType,
      });
      if (shouldSend) {
        await api.put(`/offers/${data._id}/status`, { status: 'SENT' });
        setToast({ type: 'ok', msg: 'Offer sent successfully!' });
      } else {
        setToast({ type: 'ok', msg: 'Draft saved successfully!' });
      }
      setTimeout(() => router.push('/dashboard'), 1400);
    } catch {
      setToast({ type: 'error', msg: 'Something went wrong. Please try again.' });
    } finally {
      setBusy((p) => ({ ...p, [key]: false }));
    }
  };

  /* ═══════════════ RENDER ═══════════════ */
  return (
    <div className="animate-fade-in">

      {/* ── Page Header ── */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Link href="/dashboard"
            className="p-2 rounded-xl hover:bg-white hover:shadow transition-all text-gray-500">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create Offer Letter</h1>
            <p className="text-sm text-gray-500 mt-0.5">Fill the form — preview updates live on the right</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={downloadPDF} disabled={busy.pdf}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 disabled:opacity-60 transition-colors shadow-sm">
            {busy.pdf ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            Download PDF
          </button>
          <button onClick={() => submit(false)} disabled={busy.save}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 disabled:opacity-60 transition-colors shadow-sm">
            {busy.save ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Draft
          </button>
          <button onClick={() => submit(true)} disabled={busy.send}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:opacity-60 transition-colors shadow-sm">
            {busy.send ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Send Offer
          </button>
        </div>
      </div>

      {/* ── Toast ── */}
      {toast.msg && (
        <div className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border mb-5 text-sm font-medium ${
          toast.type === 'error'
            ? 'bg-red-50 border-red-200 text-red-700'
            : 'bg-emerald-50 border-emerald-200 text-emerald-700'
        }`}>
          {toast.type === 'error'
            ? <AlertCircle className="w-4 h-4 flex-shrink-0" />
            : <CheckCircle className="w-4 h-4 flex-shrink-0" />}
          {toast.msg}
        </div>
      )}

      {/* ── Two-column layout ── */}
      <div className="grid grid-cols-1 xl:grid-cols-[460px_1fr] gap-6 items-start">

        {/* ════ LEFT — FORM ════ */}
        <div>

          {/* 1. Company Details */}
          <Section title="Company Details" icon={Building2} accent="#2563eb">
            <Field label="Company Name">
              <input name="companyName" value={form.companyName} onChange={set}
                placeholder="Company Name" className={iCls()} />
            </Field>
            <Field label="Company Address">
              <textarea name="companyAddress" value={form.companyAddress} onChange={set}
                rows={3} placeholder="Full address" className={`${iCls()} resize-none`} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Website">
                <input name="companyWebsite" value={form.companyWebsite} onChange={set}
                  placeholder="https://www.company.com" className={iCls()} />
              </Field>
              <Field label="Reference No.">
                <div className="flex gap-1.5">
                  <input name="refNumber" value={form.refNumber} onChange={set}
                    className={`${iCls()} flex-1 min-w-0`} />
                  <button type="button" title="Regenerate"
                    onClick={() => setForm((p) => ({ ...p, refNumber: mkRef() }))}
                    className="px-2.5 border border-gray-200 rounded-xl hover:bg-gray-100 text-gray-500 flex-shrink-0 transition-colors">
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Employee ID">
                <input name="employeeId" value={form.employeeId} onChange={set} className={iCls()} />
              </Field>
              <Field label="Offer Valid Until">
                <input name="offerValidUntil" type="date" value={form.offerValidUntil} onChange={set}
                  className={iCls()} />
              </Field>
            </div>
          </Section>

          {/* 2. Candidate Details */}
          <Section title="Candidate Details" icon={User} accent="#7c3aed">
            <Field label="Full Name" err={errs.candidateName}>
              <input name="candidateName" value={form.candidateName} onChange={set}
                placeholder="Candidate Full Name" className={iCls(errs.candidateName)} />
            </Field>
            <Field label="Email Address" err={errs.candidateEmail}>
              <input name="candidateEmail" type="email" value={form.candidateEmail} onChange={set}
                placeholder="candidate@email.com" className={iCls(errs.candidateEmail)} />
            </Field>
          </Section>

          {/* 3. Job Details */}
          <Section title="Job Details" icon={Briefcase} accent="#059669">
            <Field label="Job Title" err={errs.jobTitle}>
              <input name="jobTitle" value={form.jobTitle} onChange={set}
                placeholder="e.g. Senior Software Engineer" className={iCls(errs.jobTitle)} />
            </Field>
            <Field label="Office Location">
              <input name="officeAddress" value={form.officeAddress} onChange={set}
                placeholder="Branch / office address" className={iCls()} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Joining Date" err={errs.joiningDate}>
                <input name="joiningDate" type="date" value={form.joiningDate} onChange={set}
                  className={iCls(errs.joiningDate)} />
              </Field>
              <Field label="Employment Type">
                <select name="employmentType" value={form.employmentType} onChange={set}
                  className={iCls()}>
                  <option>Full-Time</option>
                  <option>Part-Time</option>
                  <option>Internship</option>
                  <option>Contract</option>
                  <option>Freelance</option>
                </select>
              </Field>
            </div>
          </Section>

          {/* 4. Salary Breakdown */}
          <Section title={`Salary Breakdown \u00A0(Monthly \u20B9)`} icon={IndianRupee} accent="#d97706">
            <div className="grid grid-cols-3 gap-3">
              <Field label="Basic Salary" err={errs.basicSalary}>
                <input name="basicSalary" type="number" min="0" value={form.basicSalary} onChange={set}
                  placeholder="0" className={iCls(errs.basicSalary)} />
              </Field>
              <Field label="HRA">
                <input name="hra" type="number" min="0" value={form.hra} onChange={set}
                  placeholder="0" className={iCls()} />
              </Field>
              <Field label="Allowances">
                <input name="allowances" type="number" min="0" value={form.allowances} onChange={set}
                  placeholder="0" className={iCls()} />
              </Field>
            </div>
            {/* CTC summary */}
            <div className="mt-1 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs uppercase tracking-wide font-semibold text-gray-500">Monthly CTC</p>
                  <p className="text-base font-bold text-gray-900 mt-0.5">{fmtInr(monthly)}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide font-semibold text-gray-500">Annual CTC</p>
                  <p className="text-lg font-bold text-blue-700 mt-0.5">{fmtInr(annual)}</p>
                </div>
              </div>
            </div>
          </Section>

          {/* 5. HR Details & Signature */}
          <Section title="HR Details &amp; Signature" icon={UserCheck} accent="#dc2626">
            <div className="grid grid-cols-2 gap-3">
              <Field label="HR Name">
                <input name="hrName" value={form.hrName} onChange={set}
                  placeholder="e.g. Priya Sharma" className={iCls()} />
              </Field>
              <Field label="Designation">
                <input name="hrDesignation" value={form.hrDesignation} onChange={set}
                  placeholder="e.g. HR Manager" className={iCls()} />
              </Field>
            </div>
            <Field label="Upload Signature  (PNG / JPG)">
              <label className="flex flex-col items-center justify-center gap-2 w-full h-24 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all">
                {form.signatureUrl
                  ? <img src={form.signatureUrl} alt="Signature preview" className="h-16 object-contain" />
                  : (
                    <>
                      <UserCheck className="w-6 h-6 text-gray-400" />
                      <span className="text-xs text-gray-500">Click to upload signature image</span>
                    </>
                  )
                }
                <input type="file" accept="image/*" onChange={onSig} className="hidden" />
              </label>
            </Field>
          </Section>

        </div>{/* /LEFT */}

        {/* ════ RIGHT — PREVIEW ════ */}
        <div className="xl:sticky xl:top-6">

          {/* Chrome bar */}
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-400 inline-block" />
              <span className="w-3 h-3 rounded-full bg-yellow-400 inline-block" />
              <span className="w-3 h-3 rounded-full bg-green-400 inline-block" />
              <span className="text-xs text-gray-500 font-medium ml-2">
                Live Preview — A4 Document
              </span>
            </div>
            <span className="text-xs bg-blue-100 text-blue-700 font-semibold px-3 py-1 rounded-full">
              {form.employmentType}
            </span>
          </div>

          {/*
            Scrollable preview container.
            The A4 document is 794px wide; we scale it to 0.76 → 603px.
            Height is NOT restricted so the full letter is scrollable.
          */}
          <div
            className="rounded-2xl overflow-auto bg-gray-100 shadow-xl border border-gray-200"
            style={{ maxHeight: 'calc(100vh - 145px)' }}
          >
            {/* Wrapper sized to scaled width so no horizontal scroll */}
            <div style={{ width: '604px', margin: '0 auto' }}>
              <div style={{
                transform: 'scale(0.76)',
                transformOrigin: 'top left',
                width: '794px',
              }}>
                <div ref={previewRef}>
                  <OfferPreview data={form} />
                </div>
              </div>
            </div>
          </div>

          {/* Annual CTC badge */}
          {annual > 0 && (
            <div className="mt-3 flex items-center justify-center gap-2 text-sm font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl py-2.5">
              <IndianRupee className="w-4 h-4" />
              Annual CTC — {fmtInr(annual)}
            </div>
          )}

        </div>{/* /RIGHT */}

      </div>
    </div>
  );
}
