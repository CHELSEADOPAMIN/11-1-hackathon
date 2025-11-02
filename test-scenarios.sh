#!/bin/bash

# 🧪 AI Patient Care System - Testing Script
# This script demonstrates different patient risk scenarios

API_URL="http://localhost:3001/api/analyze-patients"

echo "🏥 AI Patient Care System - Scenario Testing"
echo "==========================================="
echo ""

# Color codes
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to run scenario
run_scenario() {
    local scenario_name=$1
    local patient_ids=$2
    local description=$3
    
    echo -e "${BLUE}📊 Scenario: ${scenario_name}${NC}"
    echo -e "   ${description}"
    echo ""
    
    curl -X POST "$API_URL" \
      -H "Content-Type: application/json" \
      -d "{\"patientIds\": $patient_ids}" \
      -w "\n" \
      2>/dev/null | jq '.'
    
    echo ""
    echo "---"
    echo ""
}

# Check if server is running
echo "⚡ Checking if server is running..."
if ! curl -s "$API_URL" > /dev/null 2>&1; then
    echo -e "${RED}❌ Server is not running on port 3001${NC}"
    echo "Please start the server with: PORT=3001 pnpm dev"
    exit 1
fi
echo -e "${GREEN}✓ Server is running${NC}"
echo ""

# Main menu
echo "Select a testing scenario:"
echo ""
echo "  1. 🎯 Test Your Email (Sarah Johnson)"
echo "  2. 🔥 Critical Patients Only (Highest Risk)"
echo "  3. ⚠️  Medium Risk Patients"
echo "  4. 🌊 All Patients (Full Analysis)"
echo "  5. 📝 Work-Life Balance Issues (Carlos)"
echo "  6. 😰 Anxiety & Fear Patients"
echo "  7. 💔 Loss of Hope Patients"
echo "  8. 🏃 Low Risk Patients (Control Group)"
echo "  9. 🎲 Random Sample (5 patients)"
echo "  0. Exit"
echo ""
read -p "Enter your choice (0-9): " choice

case $choice in
    1)
        run_scenario "Your Test Email" \
                     "[\"2\"]" \
                     "Sarah Johnson - Your email (yangqiqi789@gmail.com)"
        ;;
    2)
        run_scenario "Critical Patients" \
                     "[\"2\", \"3\", \"10\"]" \
                     "Sarah, Mike, Rachel - Extreme dropout risk (Score 10/10)"
        ;;
    3)
        run_scenario "Medium Risk Patients" \
                     "[\"5\", \"7\", \"9\", \"11\"]" \
                     "Carlos, Marcus, David, Thomas - Manageable concerns"
        ;;
    4)
        run_scenario "Full Patient Analysis" \
                     "[]" \
                     "Analyze all 12 patients"
        ;;
    5)
        run_scenario "Work-Life Balance" \
                     "[\"5\", \"8\"]" \
                     "Carlos (work), Nina (family) - External stressors"
        ;;
    6)
        run_scenario "Anxiety & Fear" \
                     "[\"7\", \"12\"]" \
                     "Marcus (anxious), Sophia (fearful) - Psychological barriers"
        ;;
    7)
        run_scenario "Loss of Hope" \
                     "[\"3\", \"10\"]" \
                     "Mike, Rachel - Feeling defeated"
        ;;
    8)
        run_scenario "Low Risk (Control)" \
                     "[\"1\", \"4\"]" \
                     "John, Emma - Good progress, no intervention needed"
        ;;
    9)
        run_scenario "Random Sample" \
                     "[\"2\", \"5\", \"7\", \"9\", \"11\"]" \
                     "Mixed risk levels for comparison"
        ;;
    0)
        echo "👋 Goodbye!"
        exit 0
        ;;
    *)
        echo -e "${RED}Invalid choice. Please run the script again.${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}✅ Scenario complete!${NC}"
echo ""
echo "💡 Tips:"
echo "  • Check browser console (F12) for detailed logs"
echo "  • Visit http://localhost:3001/admin/patient-care for visual results"
echo "  • View full scenarios in PATIENT_SCENARIOS.md"
echo ""

