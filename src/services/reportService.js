// src/services/reportService.js
const firebaseService = require('./firebaseService');
const { getMonthRange, getDaysInMonth, groupBy } = require('../utils/helpers');
const { MONTHS } = require('../utils/constants');

class ReportService {
  // Generate monthly attendance report
  async generateMonthlyReport(memberId, year, month) {
    const { start, end } = getMonthRange(year, month);
    const daysInMonth = getDaysInMonth(year, month);
    
    // Get member stats
    const stats = await firebaseService.getMemberStats(memberId, year, month);
    
    // Create daily breakdown
    const attendanceByDate = {};
    stats.attendance.records.forEach(record => {
      attendanceByDate[record.date] = record;
    });
    
    const dailyBreakdown = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      dailyBreakdown.push({
        date: dateStr,
        day,
        dayName: new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short' }),
        present: !!attendanceByDate[dateStr]
      });
    }
    
    // Group gatha by sutra
    const gathaBysutra = groupBy(stats.gatha.records, 'sutraName');
    const sutraProgress = Object.entries(gathaBysutra).map(([sutra, records]) => {
      const newRecords = records.filter(r => r.type === 'new');
      const revisionRecords = records.filter(r => r.type === 'revision');
      
      return {
        sutraName: sutra,
        newGatha: newRecords.reduce((sum, r) => sum + (r.totalGatha || 0), 0),
        revisionGatha: revisionRecords.reduce((sum, r) => sum + (r.totalGatha || 0), 0),
        totalEntries: records.length
      };
    });
    
    return {
      period: {
        year,
        month,
        monthName: MONTHS[month - 1],
        startDate: start,
        endDate: end,
        totalDays: daysInMonth
      },
      summary: {
        daysPresent: stats.attendance.total,
        attendancePercentage: Math.round((stats.attendance.total / daysInMonth) * 100),
        totalNewGatha: stats.gatha.new.totalGatha,
        totalRevisionGatha: stats.gatha.revision.totalGatha,
        totalGathaEntries: stats.gatha.total
      },
      dailyBreakdown,
      sutraProgress,
      rawData: {
        attendance: stats.attendance.records,
        gatha: stats.gatha.records
      }
    };
  }
  
  // Generate yearly overview
  async generateYearlyReport(memberId, year) {
    const monthlyReports = [];
    
    for (let month = 1; month <= 12; month++) {
      const report = await this.generateMonthlyReport(memberId, year, month);
      monthlyReports.push({
        month,
        monthName: MONTHS[month - 1],
        summary: report.summary
      });
    }
    
    // Calculate yearly totals
    const yearlyTotals = monthlyReports.reduce((acc, report) => {
      acc.totalDaysPresent += report.summary.daysPresent;
      acc.totalNewGatha += report.summary.totalNewGatha;
      acc.totalRevisionGatha += report.summary.totalRevisionGatha;
      return acc;
    }, {
      totalDaysPresent: 0,
      totalNewGatha: 0,
      totalRevisionGatha: 0
    });
    
    return {
      year,
      monthlyReports,
      yearlyTotals
    };
  }
  
  // Generate progress chart data
  async generateProgressChartData(memberId, months = 6) {
    const chartData = [];
    const now = new Date();
    
    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      
      const stats = await firebaseService.getMemberStats(memberId, year, month);
      
      chartData.push({
        month: MONTHS[month - 1].substring(0, 3),
        year,
        attendance: stats.attendance.total,
        newGatha: stats.gatha.new.totalGatha,
        revisionGatha: stats.gatha.revision.totalGatha
      });
    }
    
    return chartData;
  }
  
  // Get all students report (admin)
  async generateAllStudentsReport(year, month) {
    const users = await firebaseService.getUsersByRole('user');
    const reports = [];
    
    for (const user of users) {
      if (user.members && user.members.length > 0) {
        for (const member of user.members) {
          const stats = await firebaseService.getMemberStats(member.id, year, month);
          reports.push({
            groupName: user.groupName || user.name,
            memberName: member.name,
            memberId: member.id,
            daysPresent: stats.attendance.total,
            newGatha: stats.gatha.new.totalGatha,
            revisionGatha: stats.gatha.revision.totalGatha
          });
        }
      }
    }
    
    // Sort by attendance (descending)
    reports.sort((a, b) => b.daysPresent - a.daysPresent);
    
    return {
      period: {
        year,
        month,
        monthName: MONTHS[month - 1]
      },
      totalStudents: reports.length,
      reports
    };
  }
}

module.exports = new ReportService();
